package org.acme.cpu.core.exception;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
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
public class UncaughtExceptionMapper implements ExceptionMapper<Throwable> {

    @ConfigProperty(name = "problem.base-url")
    String baseUrl;

    @Context
    UriInfo uriInfo;

    @Inject
    Logger LOG;

    @Override
    public Response toResponse(Throwable t) {
        LOG.errorf(t, "Erro inesperado em %s", (uriInfo != null ? uriInfo.getRequestUri() : "<no-uri>"));

        Problem p = new Problem();
        p.type = baseUrl + "/errors/unexpected-error";
        p.title = "Erro inesperado";
        p.status = Response.Status.INTERNAL_SERVER_ERROR.getStatusCode();
        p.detail = "Ocorreu um erro inesperado. Tente novamente mais tarde.";
        p.instance = (uriInfo != null ? uriInfo.getRequestUri().getPath() : null);
        p.timestamp = OffsetDateTime.now();

        return Response.status(p.status)
                .type("application/problem+json")
                .entity(p)
                .build();
    }
}