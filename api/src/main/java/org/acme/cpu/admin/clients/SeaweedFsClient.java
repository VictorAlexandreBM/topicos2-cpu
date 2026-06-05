package org.acme.cpu.admin.clients;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;
import org.jboss.resteasy.reactive.RestForm;

import java.io.File;

@RegisterRestClient(configKey = "seaweedfs-api")
public interface SeaweedFsClient {

    /**
     * Faz o upload do arquivo para o Filer do SeaweedFS.
     * O caminho final será algo como: http://localhost:8888/{diretorio}/{nomeArquivo}
     */
    @POST
    @Path("/{diretorio}/{nomeArquivo}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    Response enviarArquivo(
            @PathParam("diretorio") String diretorio,
            @PathParam("nomeArquivo") String nomeArquivo,
            @RestForm("file") File arquivo
    );

    @DELETE
    @Path("/{diretorio}/{nomeArquivo}")
    Response deletarArquivo(
            @PathParam("diretorio") String diretorio,
            @PathParam("nomeArquivo") String nomeArquivo
    );
}