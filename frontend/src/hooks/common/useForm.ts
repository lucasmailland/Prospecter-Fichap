import { useState, useCallback, useMemo } from 'react';

// Tipos para validación
export type ValidationRule<T = any> = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
  email?: boolean;
  min?: number;
  max?: number;
};

export type ValidationSchema<T> = {
  [K in keyof T]?: ValidationRule<T[K]>;
};

export interface UseFormConfig<T> {
  initialValues: T;
  validationSchema?: ValidationSchema<T>;
  onSubmit?: (values: T) => Promise<void> | void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

// Validadores predefinidos
const validators = {
  required: (value: unknown) => {
    if (value === null || value === undefined || value === '') {
      return 'Este campo es requerido';
    }
    return null;
  },
  
  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return 'Formato de email inválido';
    }
    return null;
  },
  
  minLength: (value: string, min: number) => {
    if (value && value.length < min) {
      return `Mínimo ${min} caracteres`;
    }
    return null;
  },
  
  maxLength: (value: string, max: number) => {
    if (value && value.length > max) {
      return `Máximo ${max} caracteres`;
    }
    return null;
  },
  
  pattern: (value: string, pattern: RegExp) => {
    if (value && !pattern.test(value)) {
      return 'Formato inválido';
    }
    return null;
  },
  
  min: (value: number, min: number) => {
    if (value !== null && value !== undefined && value < min) {
      return `Valor mínimo: ${min}`;
    }
    return null;
  },
  
  max: (value: number, max: number) => {
    if (value !== null && value !== undefined && value > max) {
      return `Valor máximo: ${max}`;
    }
    return null;
  },
};

/**
 * Hook avanzado para manejo de formularios con validación robusta
 */
export function useForm<T extends Record<string, any>>({
  initialValues,
  validationSchema = {},
  onSubmit,
  validateOnChange = false,
  validateOnBlur = true,
}: UseFormConfig<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validar un campo específico
  // const _validateField = useCallback((name: keyof T, value: unknown): string | null => {
    const rules = validationSchema[name];
    if (!rules) return null;

    // Validación requerido
    if (rules.required) {
      const error = validators.required(value);
      if (error) return error;
    }

    // Si el campo está vacío y no es requerido, no validar más
    if (!value && !rules.required) return null;

    // Validación email
    if (rules.email) {
      const error = validators.email(value);
      if (error) return error;
    }

    // Validación longitud mínima
    if (rules.minLength !== undefined) {
      const error = validators.minLength(value, rules.minLength);
      if (error) return error;
    }

    // Validación longitud máxima
    if (rules.maxLength !== undefined) {
      const error = validators.maxLength(value, rules.maxLength);
      if (error) return error;
    }

    // Validación patrón
    if (rules.pattern) {
      const error = validators.pattern(value, rules.pattern);
      if (error) return error;
    }

    // Validación valor mínimo
    if (rules.min !== undefined) {
      const error = validators.min(value, rules.min);
      if (error) return error;
    }

    // Validación valor máximo
    if (rules.max !== undefined) {
      const error = validators.max(value, rules.max);
      if (error) return error;
    }

    // Validación personalizada
    if (rules.custom) {
      const error = rules.custom(value);
      if (error) return error;
    }

    return null;
  }, [validationSchema]);

  // Validar todos los campos
  // const _validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(values).forEach((key) => {
      const fieldKey = key as keyof T;
      const error = validateField(fieldKey, values[fieldKey]);
      if (error) {
        newErrors[fieldKey] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validateField]);

  // Cambiar valor de un campo
  // const _setValue = useCallback((name: keyof T, value: unknown) => {
    setValues(prev => ({ ...prev, [name]: value }));

    if (validateOnChange) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error || undefined }));
    }
  }, [validateField, validateOnChange]);

  // Cambiar múltiples valores
  // const _setMultipleValues = useCallback((newValues: Partial<T>) => {
    setValues(prev => ({ ...prev, ...newValues }));
  }, []);

  // Manejar cambio de input
  // const _handleChange = useCallback((name: keyof T) => {
    return (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { value, type } = event.target;
      const finalValue = type === 'checkbox' 
        ? (event.target as HTMLInputElement).checked 
        : type === 'number' 
        ? value === '' ? null : Number(value)
        : value;
      
      setValue(name, finalValue);
    };
  }, [setValue]);

  // Manejar blur
  // const _handleBlur = useCallback((name: keyof T) => {
    return () => {
      setTouched(prev => ({ ...prev, [name]: true }));
      
      if (validateOnBlur) {
        const error = validateField(name, values[name]);
        setErrors(prev => ({ ...prev, [name]: error || undefined }));
      }
    };
  }, [validateField, validateOnBlur, values]);

  // Manejar submit
  // const _handleSubmit = useCallback((event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    const isValid = validateForm();
    if (!isValid) return;

    if (onSubmit) {
      setIsSubmitting(true);
      Promise.resolve(onSubmit(values))
        .finally(() => setIsSubmitting(false));
    }
  }, [validateForm, onSubmit, values]);

  // Reset del formulario
  // const _reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Validez del formulario - SOLO considerar errores de campos tocados
  // const _isValid = useMemo(() => {
    // Si no se ha tocado ningún campo, considerar válido para permitir envío
    const touchedFields = Object.keys(touched).filter(key => touched[key as keyof T]);
    if (touchedFields.length === 0) {
      return false; // No permitir envío hasta que se toque al menos un campo
    }

    // Solo verificar errores en campos tocados
    const touchedErrors = touchedFields.filter(key => errors[key as keyof T]);
    return touchedErrors.length === 0;
  }, [errors, touched]);

  // ✅ NUEVO: Validez para envío (más permisiva)
  // const _canSubmit = useMemo(() => {
    // Verificar que todos los campos requeridos estén completos
    const allRequiredFieldsValid = Object.keys(validationSchema).every(key => {
      const fieldKey = key as keyof T;
      const rules = validationSchema[fieldKey];
      const value = values[fieldKey];
      
      // Si es requerido, debe tener valor
      if (rules?.required) {
        if (value === null || value === undefined || value === '' || value === false) {
          return false;
        }
      }
      
      return true;
    });

    // No debe haber errores críticos
    const hasNoErrors = Object.keys(errors).length === 0;
    
    return allRequiredFieldsValid && hasNoErrors;
  }, [values, errors, validationSchema]);

  // Campos tocados con errores
  // const _hasErrors = useMemo(() => {
    return Object.keys(errors).some(key => touched[key as keyof T] && errors[key as keyof T]);
  }, [errors, touched]);

  return {
    // Estados
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    canSubmit,
    hasErrors,
    
    // Métodos de cambio
    setValue,
    setMultipleValues,
    handleChange,
    handleBlur,
    
    // Validación
    validateField,
    validateForm,
    
    // Acciones
    handleSubmit,
    reset,
  };
} 