package org.acme.cpu.core.exception;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.ClientErrorException;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

import java.time.OffsetDateTime;

@Provider
@ApplicationScoped
public class ClientErrorExceptionMapper implements ExceptionMapper<ClientErrorException> {

    @ConfigProperty(name = "problem.base-url")
    String baseUrl;

    @Context
    UriInfo uriInfo;

    @Inject
    Logger LOG;

    @Override
    public Response toResponse(ClientErrorException e) {
        Response.Status status = e.getResponse().getStatusInfo().toEnum();
        var p = new Problem();
        p.type = baseUrl + "/errors/conflict";
        p.title = status == Response.Status.CONFLICT ?
            "Conflito de dados" : "Método não permitido";
        p.status = status.getStatusCode();
        p.detail = e.getMessage();
        p.instance = (uriInfo != null ? uriInfo.getRequestUri().getPath() : null);
        p.timestamp = OffsetDateTime.now();

        LOG.warnf("Conflict (409) na URL '%s': %s", p.instance, e.getMessage());


        return Response.status(p.status)
                .type("application/problem+json")
                .entity(p)
                .build();
    }
}
