export const GLOBAL_ERROR_MAP: { [key: string]: (args?: any) => string} = {
  'required': () => `Este campo é obrigatório`,
  'minLength': (args) => `O tamanho mínimo deste campo é ${args.requiredLength} caracteres`,
  'maxLength': (args) => `O tamanho máximo deste campo é ${args.requiredLength} caracteres`,
}
