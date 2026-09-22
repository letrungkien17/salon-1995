namespace Salon1995.Api.Services;

public class OrderService : BookingService, IOrderService
{
    public OrderService(
        Repository.IBookingRepository bookingRepository,
        Repository.IUserRepository userRepository,
        Repository.IServiceRepository serviceRepository,
        Repository.IEmployeeRepository employeeRepository,
        Repository.IBranchRepository branchRepository,
        Repository.IVoucherRepository voucherRepository,
        IQueueService queueService,
        ILogger<BookingService> logger)
        : base(bookingRepository, userRepository, serviceRepository, employeeRepository, branchRepository, voucherRepository, queueService, logger)
    {
    }
}
