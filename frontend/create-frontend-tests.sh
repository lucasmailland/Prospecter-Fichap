#!/bin/bash

echo "🚀 Generando tests básicos para el frontend..."

# Crear directorio de tests si no existe
mkdir -p src/__tests__

# Test básico para página principal
cat > src/app/page.test.tsx << 'EOF'
import { render, screen } from '@testing-library/react'
import Page from './page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

describe('Page', () => {
  it('renders without crashing', () => {
    render(<Page />)
    expect(document.body).toBeInTheDocument()
  })

  it('should be defined', () => {
    expect(Page).toBeDefined()
  })
})
EOF

# Test básico para layout
cat > src/app/layout.test.tsx << 'EOF'
import { render } from '@testing-library/react'
import RootLayout from './layout'

describe('RootLayout', () => {
  it('renders children', () => {
    const { container } = render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    )
    
    expect(container.textContent).toContain('Test Content')
  })

  it('should be defined', () => {
    expect(RootLayout).toBeDefined()
  })
})
EOF

# Test para contextos
cat > src/contexts/AuthContext.test.tsx << 'EOF'
import { render, screen } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'

function TestComponent() {
  const auth = useAuth()
  return <div data-testid="auth-context">{auth ? 'loaded' : 'loading'}</div>
}

describe('AuthContext', () => {
  it('provides auth context', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    expect(screen.getByTestId('auth-context')).toBeInTheDocument()
  })

  it('should be defined', () => {
    expect(AuthProvider).toBeDefined()
  })
})
EOF

# Test para hooks básicos
cat > src/hooks/useLocalStorage.test.ts << 'EOF'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should initialize with default value', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    
    expect(result.current[0]).toBe('default')
  })

  it('should update localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    
    act(() => {
      result.current[1]('updated')
    })
    
    expect(localStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('updated'))
  })

  it('should be defined', () => {
    expect(useLocalStorage).toBeDefined()
  })
})
EOF

# Test para componentes UI básicos
cat > src/components/ui/Button.test.tsx << 'EOF'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be defined', () => {
    expect(Button).toBeDefined()
  })
})
EOF

# Test para servicios
cat > src/services/api.service.test.ts << 'EOF'
import { ApiService } from './api.service'

// Mock fetch
global.fetch = jest.fn()

describe('ApiService', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should be defined', () => {
    expect(ApiService).toBeDefined()
  })

  it('makes GET requests', async () => {
    const mockResponse = { data: 'test' }
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })

    const apiService = new ApiService()
    const result = await apiService.get('/test')

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test'),
      expect.objectContaining({
        method: 'GET',
      })
    )
    expect(result).toEqual(mockResponse)
  })

  it('handles errors', async () => {
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    const apiService = new ApiService()
    
    await expect(apiService.get('/test')).rejects.toThrow('Network error')
  })
})
EOF

# Test para utils
cat > src/utils/formatters.test.ts << 'EOF'
import { formatDate, formatCurrency, formatPhoneNumber } from './formatters'

describe('Formatters', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-01-01')
      const result = formatDate(date)
      
      expect(typeof result).toBe('string')
      expect(result).toContain('2024')
    })

    it('should be defined', () => {
      expect(formatDate).toBeDefined()
    })
  })

  describe('formatCurrency', () => {
    it('formats currency correctly', () => {
      const result = formatCurrency(1234.56)
      
      expect(typeof result).toBe('string')
      expect(result).toContain('1234')
    })

    it('should be defined', () => {
      expect(formatCurrency).toBeDefined()
    })
  })

  describe('formatPhoneNumber', () => {
    it('formats phone number correctly', () => {
      const result = formatPhoneNumber('1234567890')
      
      expect(typeof result).toBe('string')
    })

    it('should be defined', () => {
      expect(formatPhoneNumber).toBeDefined()
    })
  })
})
EOF

# Crear tests para componentes complejos
echo "📝 Creando tests para componentes principales..."

# Test para componente de autenticación
cat > src/components/auth/LoginForm.test.tsx << 'EOF'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  it('renders login form', () => {
    render(<LoginForm />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('submits form with valid data', async () => {
    const mockSubmit = jest.fn()
    render(<LoginForm onSubmit={mockSubmit} />)
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    })
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }))
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })

  it('should be defined', () => {
    expect(LoginForm).toBeDefined()
  })
})
EOF

# Test para componente de tabla
cat > src/components/table/DataTable.test.tsx << 'EOF'
import { render, screen } from '@testing-library/react'
import { DataTable } from './DataTable'

const mockData = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
]

const mockColumns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
]

describe('DataTable', () => {
  it('renders table with data', () => {
    render(<DataTable data={mockData} columns={mockColumns} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
  })

  it('renders empty state', () => {
    render(<DataTable data={[]} columns={mockColumns} />)
    
    expect(screen.getByText(/no data/i)).toBeInTheDocument()
  })

  it('should be defined', () => {
    expect(DataTable).toBeDefined()
  })
})
EOF

# Test para páginas principales
cat > src/app/leads/page.test.tsx << 'EOF'
import { render, screen } from '@testing-library/react'
import LeadsPage from './page'

// Mock componentes que pueden causar problemas
jest.mock('../../components/table/DataTable', () => ({
  DataTable: () => <div data-testid="data-table">Data Table</div>,
}))

describe('LeadsPage', () => {
  it('renders leads page', () => {
    render(<LeadsPage />)
    
    expect(screen.getByText(/leads/i)).toBeInTheDocument()
  })

  it('should be defined', () => {
    expect(LeadsPage).toBeDefined()
  })
})
EOF

echo "✅ Tests básicos del frontend generados exitosamente"
echo "📊 Tests creados:"
echo "  - Páginas: 3 archivos"
echo "  - Componentes: 4 archivos"
echo "  - Hooks: 1 archivo"
echo "  - Servicios: 1 archivo"
echo "  - Utils: 1 archivo"
echo "  - Total: 10 archivos de test"

echo ""
echo "🚀 Para ejecutar los tests:"
echo "  npm test"
echo "  npm run test:coverage" 