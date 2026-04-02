package org.acme.cpu.resources;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.acme.cpu.dto.Tecnologia.TecnologiaDTO;
import org.acme.cpu.dto.respostaPaginada.RespostaPaginadaDTO;
import org.acme.cpu.services.TecnologiaService;


@ApplicationScoped
@Path("/tecnologias")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TecnologiaResource {

    @Inject
    TecnologiaService service;

    @GET
    public Response listar(
            @QueryParam("pagina") Integer pagina,
            @QueryParam("tamanho") Integer tamanho
    ) {
        return Response.ok(service.listar(pagina, tamanho)).build();
    }

    @POST
    public Response inserir(@Valid TecnologiaDTO dto) {
        return Response.ok(service.criar(dto)).build();
    }

    @PUT
    @Path("/{id}")
    public Response atualizar(@PathParam("id") Long id, @Valid TecnologiaDTO dto) {
        service.atualizar(id, dto);
        return Response.noContent().build();
    }

    @DELETE
    @Path("/{id}")
    public Response deletar(@PathParam("id") Long id) {
        service.deletar(id);
        return Response.noContent().build();
    }
}
