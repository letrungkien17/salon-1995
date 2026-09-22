namespace Salon1995.Api.Services;

public interface IQueueService
{
    Task PublishBookingEventAsync<T>(string eventType, T message);
}
