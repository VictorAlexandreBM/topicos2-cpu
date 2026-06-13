package org.acme.cpu.cliente.resources;

import io.quarkus.panache.common.Sort;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.acme.cpu.cliente.dtos.localizacao.CidadeResponseDTO;
import org.acme.cpu.cliente.dtos.localizacao.EstadoResponseDTO;
import org.acme.cpu.cliente.repositories.CidadeRepository;
import org.acme.cpu.cliente.repositories.EstadoRepository;

import java.util.List;

@Path("/localizacao")
@Produces(MediaType.APPLICATION_JSON)
public class LocalizacaoResource {

    @Inject
    EstadoRepository estadoRepository;

    @Inject
    CidadeRepository cidadeRepository;

    @GET
    @Path("/estados")
    public List<EstadoResponseDTO> listarEstados() {
        return estadoRepository.listAll(Sort.by("nome")).stream()
                .map(EstadoResponseDTO::new)
                .toList();
    }

    @GET
    @Path("/estados/{sigla}/cidades")
    public List<CidadeResponseDTO> listarCidades(@PathParam("sigla") String sigla) {
        return cidadeRepository.findByEstadoSigla(sigla).stream()
                .map(CidadeResponseDTO::new)
                .toList();
    }
}