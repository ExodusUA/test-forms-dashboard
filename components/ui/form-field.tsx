import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface BaseFieldProps {
    label: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
}

interface InputFieldProps extends BaseFieldProps {
    type?: 'text' | 'email' | 'number';
    inputProps: InputHTMLAttributes<HTMLInputElement>;
}

interface TextareaFieldProps extends BaseFieldProps {
    textareaProps: TextareaHTMLAttributes<HTMLTextAreaElement>;
}

interface SelectFieldProps extends BaseFieldProps {
    options: readonly { value: string; label: string }[];
    selectProps: InputHTMLAttributes<HTMLSelectElement>;
}

type FormFieldProps =
    | ({ fieldType: 'input' } & InputFieldProps)
    | ({ fieldType: 'textarea' } & TextareaFieldProps)
    | ({ fieldType: 'select' } & SelectFieldProps);

export function FormField(props: FormFieldProps) {
    const { label, error, required, disabled } = props;

    const inputClasses = `block w-full rounded-md border ${error ? 'border-red-500' : 'border-gray-700'
        } bg-gray-800 text-white px-3 py-2 shadow-sm focus:border-brand-orange focus:ring-1 focus:ring-brand-orange focus:outline-none`;

    return (
        <div>
            <label htmlFor={props.fieldType === 'input' ? props.inputProps.id : props.fieldType === 'textarea' ? props.textareaProps.id : props.selectProps.id} className="block mb-2 text-sm font-medium text-gray-200">
                {label}
                {required && <span className="text-red-500"> *</span>}
            </label>

            {props.fieldType === 'input' && (
                <input
                    type={props.type || 'text'}
                    className={inputClasses}
                    disabled={disabled}
                    {...props.inputProps}
                />
            )}

            {props.fieldType === 'textarea' && (
                <textarea
                    className={inputClasses}
                    disabled={disabled}
                    {...props.textareaProps}
                />
            )}

            {props.fieldType === 'select' && (
                <select
                    className={inputClasses}
                    disabled={disabled}
                    {...props.selectProps}
                >
                    {props.options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            )}

            {error && (
                <p className="mt-1 text-sm text-red-400">{error}</p>
            )}
        </div>
    );
}
