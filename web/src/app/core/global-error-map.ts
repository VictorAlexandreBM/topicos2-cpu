export const GLOBAL_ERROR_MAP: { [key: string]: (args?: any) => string} = {
  'required': () => `Este campo é obrigatório`,
  'minLength': (args) => `O tamanho mínimo deste campo é ${args.requiredLength} caracteres`,
  'maxLength': (args) => `O tamanho máximo deste campo é ${args.requiredLength} caracteres`,
  'min': (args) => `Valor mínimo de ${args.min}`,
  'pattern': (args) => {
    const regex = args.requiredPattern;

    if (regex === '^[0-9]*$') {
      return 'Este campo aceita apenas números inteiros';
    }

    if (regex === '^[0-9]*[.,]?[0-9]+$' || regex === '^[0-9]*[.]?[0-9]+$') {
      return 'Este campo aceita apenas números decimais ou inteiros';
    }

    return 'O formato digitado é inválido';
  }
}
