export const formatCPF = (value: string) =>
  value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .slice(0, 14);

export const formatDate = (value: string) =>
  value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d{1,4})$/, '$1/$2')
    .slice(0, 10);

export const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, '')
    .replace(/(.{4})/g, '$1 ')
    .trim();

export const formatExpiration = (value: string) =>
  value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d{1,2})/, '$1/$2')
    .slice(0, 5);

export const formatCvv = (value: string) =>
  value.replace(/\D/g, '').slice(0, 4);
