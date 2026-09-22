using Salon1995.Api.Models;

namespace Salon1995.Api.Repository;

public interface IUserRepository
{
    Task<User?> GetByUsernameAsync(string username);
    Task<Customer?> GetCustomerByPhoneAsync(string phone);
    Task<Customer?> GetCustomerByEmailAsync(string email);
    Task<Customer?> GetCustomerByIdAsync(int id);
    Task<Customer> AddCustomerAsync(Customer customer);
    Task UpdateCustomerAsync(Customer customer);
    Task<User> AddUserAsync(User user);
    Task UpdateUserAsync(User user);
}
