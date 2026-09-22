using Salon1995.Api.Models;
using Salon1995.Api.Repository;

namespace Salon1995.Api.Services;

public class ProductService : IProductService
{
    private readonly IServiceRepository _serviceRepository;
    private readonly IProductRepository _productRepository;

    public ProductService(IServiceRepository serviceRepository, IProductRepository productRepository)
    {
        _serviceRepository = serviceRepository;
        _productRepository = productRepository;
    }

    public async Task<IEnumerable<Service>> GetAllServicesAsync(int? categoryId = null, string? search = null)
    {
        return await _serviceRepository.GetAllAsync(categoryId, search);
    }

    public async Task<Service?> GetServiceByIdAsync(int id)
    {
        return await _serviceRepository.GetByIdAsync(id);
    }

    public async Task<IEnumerable<Product>> GetAllProductsAsync(int? branchId = null)
    {
        return await _productRepository.GetAllAsync(branchId);
    }
}
