package org.acme.cpu.cliente.resources;

import io.quarkus.security.Authenticated;
import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import org.acme.cpu.cliente.dtos.usuario.*;
import org.acme.cpu.cliente.services.token.TokenService;
import org.acme.cpu.cliente.services.usuario.UsuarioService;

public class UsuarioResource {

    @Inject
    UsuarioService service;

    @Inject
    TokenService tokenService;

    @POST
    @Path("/login")
    @PermitAll
    public Response login(UsuarioLoginDTO dto) {
        UsuarioLogadoResponseDTO authInfo = service.logar(dto);
        return Response.ok(authInfo).build();
    }


    @POST
    @Path("/refresh")
    @Authenticated
    public Response refresh(UsuarioLogadoDTO dto) {
        UsuarioLogadoResponseDTO authInfo = tokenService.validarRefreshToken(dto.refreshToken());
        return Response.ok(authInfo).build();
    }

    @POST
    @Path("/logout")
    @Authenticated
    public Response logout(UsuarioLogadoDTO dto) {
        tokenService.invalidarRefreshToken(dto.refreshToken());

        return Response.noContent().build();
    }

    @GET
    @Path("/eu")
    @Authenticated
    public Response eu(@Context SecurityContext ctx) {
        String email = ctx.getUserPrincipal().getName();

        UsuarioResponseDTO usuario = service.findByLogin(email);

        return Response.ok(usuario).build();
    }

    @POST
    @PermitAll
    public Response cadastrar(@Valid UsuarioCadastroDTO dto) {
        return Response.status(Response.Status.CREATED).entity(service.cadastrar(dto)).build();
    }

}
