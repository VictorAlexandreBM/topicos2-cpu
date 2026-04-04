  import TecnologiaService from '../../services/tecnologia.service';
  import {Component, inject, signal} from '@angular/core';
  import {toObservable, toSignal} from '@angular/core/rxjs-interop';
  import TecnologiaTableComponent from '../../components/tecnologia/tecnologia-table/tecnologia-table.component';
  import {TecnologiaFormComponent} from '../../components/tecnologia/tecnologia-form/tecnologia-form.component';
  import {catchError, finalize, switchMap, tap, throwError} from 'rxjs';
  import {MatButton, MatFabButton, MatIconButton} from '@angular/material/button';
  import {MatIcon} from '@angular/material/icon';
  import {Tecnologia} from '../../models/tecnologia.model';
  import {PageEvent} from '@angular/material/paginator';
  import {TecnologiaFiltroComponent} from '../../components/tecnologia/tecnologia-filtro/tecnologia-filtro.component';
  import {HttpErrorResponse} from '@angular/common/http';
  import {MatDialog} from '@angular/material/dialog';
  import {Sort} from '@angular/material/sort';
  import {ParametrosListagem} from '../../../../core/models/parametros-lista.model';



  @Component({
    selector: 'app-tecnologia-page',
    templateUrl: './tecnologia.page.html',
    styleUrl: 'tecnologia.page.css',
    imports: [
      TecnologiaTableComponent,
      MatIcon,
      TecnologiaFiltroComponent,
      MatButton
    ]
  })
  export default class TecnologiaPage {
    private readonly service = inject(TecnologiaService)
    private refreshTrigger = signal<ParametrosListagem>({pagina: 0, tamanho: 10, filtro: '', ativo: true, campoOrdenacao: 'nome', direcao: 'asc'});
    private dialog = inject(MatDialog);

    protected estaCarregando = signal(false);
    protected erroGerado = signal<HttpErrorResponse|null>(null);

    private readonly tecnologiasResponse$ = toObservable(this.refreshTrigger).pipe(
      tap(() => {
        this.estaCarregando.set(true)
        this.erroGerado.set(null);
      }),
      switchMap(r =>
        this.service.listar(r).pipe(
          finalize(() => this.estaCarregando.set(false)),
          catchError((err: HttpErrorResponse) => {
            this.erroGerado.set(err);
            return throwError(() => err)
          })
        ))
    )

    protected readonly tecnologiasResponse = toSignal(this.tecnologiasResponse$);

    protected tecnologiaEmEdicao = signal<Tecnologia | null>(null);

    refreshTecnologias() {
      this.refreshTrigger.update((r) => ({...r}));
    }

    handleEdicao(t: Tecnologia | null) {
      this.tecnologiaEmEdicao.set(t);
      if (!t) {
        this.abrirFormulario();
        return;
      }
      this.abrirFormulario(t);
    }

    handleDelecao(tecnologia: Tecnologia) {
      this.refreshTecnologias();
      if (this.tecnologiaEmEdicao() === tecnologia) {
        this.tecnologiaEmEdicao.set(null);
        this.dialog.closeAll()
      }
    }

    handleMudancaPagina(event: PageEvent) {
      this.refreshTrigger.update(r => ({...r, pagina: event.pageIndex, tamanho: event.pageSize}));
    }

    handleMudancaOrdem(event: Sort) {
      console.log(event);
      this.refreshTrigger.update(r => ({...r, pagina: 0, campoOrdenacao: event.active, direcao: event.direction}));
      console.log(this.refreshTrigger());
    }

    handleEstadoAlterado(tecnologia: Tecnologia) {
      this.refreshTecnologias();
      if (this.tecnologiaEmEdicao() === tecnologia) {
        this.tecnologiaEmEdicao.set(null);
      }
    }

    handlePesquisa(filtro: string) {
      this.refreshTrigger.update(r => ({...r, pagina: 0, filtro}));
    }

    handleMostrarInativos(mostrarInativos: boolean) {
      this.refreshTrigger.update(r => ({...r, pagina: 0, ativo: !mostrarInativos}));

    }

    abrirFormulario(tecnologia?: Tecnologia) {
      this.dialog.closeAll();

      const dialogRef = this.dialog.open(TecnologiaFormComponent, {
        position: { right: '0', top: '0', bottom: '0' },
        height: '100vh',
        width: '400px',
        hasBackdrop: false,
        disableClose: true,
        panelClass: 'slide-over-panel',
        data: tecnologia
      });

      const subCadastro = dialogRef.componentInstance.tecnologiaCadastrada.subscribe(t => {
        this.refreshTecnologias();
        this.tecnologiaEmEdicao.set(null);
      })

      const subAtualizacao = dialogRef.componentInstance.tecnologiaAtualizada.subscribe(t => {
        this.refreshTecnologias();
        this.tecnologiaEmEdicao.set(null);

        this.abrirFormulario();
      })

      const subCancelado = dialogRef.componentInstance.cadastroCancelado.subscribe( () => {
        this.tecnologiaEmEdicao.set(null);
      })

      dialogRef.afterClosed().subscribe( () => {
        subAtualizacao.unsubscribe();
        subCadastro.unsubscribe();
        subCancelado.unsubscribe();
      });
    }
  }
