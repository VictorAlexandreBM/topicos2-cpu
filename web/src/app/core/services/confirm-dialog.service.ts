import {inject, Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../components/option-dialog/confirm-dialog.component';
import {firstValueFrom} from 'rxjs';

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
export class ConfirmDialogService {
  private dialog = inject(MatDialog);

  public async alertar(titulo: string, mensagem: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {titulo: titulo, mensagem: mensagem}
    })

    const confirmado = await firstValueFrom(dialogRef.afterClosed());
    return confirmado!!;
  }

}
