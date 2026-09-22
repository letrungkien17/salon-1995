using System.Text;
using System.Text.Json;
using RabbitMQ.Client;

namespace Salon1995.Api.Services;

public class RabbitMqQueueService : IQueueService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<RabbitMqQueueService> _logger;

    public RabbitMqQueueService(IConfiguration configuration, ILogger<RabbitMqQueueService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task PublishBookingEventAsync<T>(string eventType, T message)
    {
        var hostName = _configuration["RabbitMQ:Host"] ?? "localhost";
        var port = int.TryParse(_configuration["RabbitMQ:Port"], out var p) ? p : 5672;
        var userName = _configuration["RabbitMQ:UserName"] ?? "guest";
        var password = _configuration["RabbitMQ:Password"] ?? "guest";

        try
        {
            var factory = new ConnectionFactory
            {
                HostName = hostName,
                Port = port,
                UserName = userName,
                Password = password
            };

            using var connection = await factory.CreateConnectionAsync();
            using var channel = await connection.CreateChannelAsync();

            const string queueName = "salon1995.bookings.queue";
            await channel.QueueDeclareAsync(
                queue: queueName,
                durable: true,
                exclusive: false,
                autoDelete: false,
                arguments: null
            );

            var payload = new
            {
                EventType = eventType,
                Timestamp = DateTime.UtcNow,
                Data = message
            };

            var json = JsonSerializer.Serialize(payload);
            var body = Encoding.UTF8.GetBytes(json);

            var props = new BasicProperties
            {
                Persistent = true,
                ContentType = "application/json"
            };

            await channel.BasicPublishAsync(
                exchange: string.Empty,
                routingKey: queueName,
                mandatory: false,
                basicProperties: props,
                body: body
            );

            _logger.LogInformation("Đã đẩy sự kiện {EventType} vào RabbitMQ queue '{QueueName}'", eventType, queueName);
        }
        catch (Exception ex)
        {
            _logger.LogWarning("Không thể kết nối tới RabbitMQ ({HostName}:{Port}). Chi tiết: {Message}", hostName, port, ex.Message);
        }
    }
}
