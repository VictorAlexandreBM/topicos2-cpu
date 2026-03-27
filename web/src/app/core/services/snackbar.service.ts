import {inject, Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';

interface SnackbarOptions {
  duracao?: number;
  posicaoVertical?: MatSnackBarVerticalPosition;
  posicaoHorizontal?: MatSnackBarHorizontalPosition;
}

@Injectable(
  {
    providedIn: 'root'
  }
)
export class SnackbarService {
  private snackbar = inject(MatSnackBar);

  public alertar(mensagem: string, opcoes?: SnackbarOptions) {
    this.snackbar.open(mensagem, '', {
      duration: opcoes?.duracao || 3000,
      verticalPosition: opcoes?.posicaoVertical || 'top',
      horizontalPosition: opcoes?.posicaoHorizontal || 'center'
    });
  }
}
