package org.acme.cpu.dto.modeloCpu;

import org.acme.cpu.dto.chipset.ChipsetResponseDTO;
import org.acme.cpu.dto.marca.MarcaResponseDTO;
import org.acme.cpu.dto.modeloCpu.clusterNucleo.ClusterNucleoResponseDTO;
import org.acme.cpu.dto.modeloCpu.fichaTecnica.FichaTecnicaResponseDTO;
import org.acme.cpu.dto.socket.SocketResponseDTO;
import org.acme.cpu.dto.tecnologia.TecnologiaResponseDTO;
import org.acme.cpu.models.ModeloCpu;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

public record ModeloCpuDetailDTO(
        Long id,
        String nome,
        Boolean ativo,
        LocalDateTime dataCriacao,
        MarcaResponseDTO marca,
        SocketResponseDTO socket,
        Set<ChipsetResponseDTO> chipsets,
        Set<TecnologiaResponseDTO> tecnologias,
        FichaTecnicaResponseDTO fichaTecnica,
        Set<ClusterNucleoResponseDTO> clustersNucleo
) {
    public ModeloCpuDetailDTO(ModeloCpu m) {
        this(
            m.getId(),
            m.getNome(),
            m.isAtivo(),
            m.getDataCriacao(),
            m.getMarca() != null ? new MarcaResponseDTO(m.getMarca()) : null,
            m.getSocket() != null ? new SocketResponseDTO(m.getSocket()) : null,
            m.getChipsets() != null ? m.getChipsets().stream().map(ChipsetResponseDTO::new).collect(Collectors.toSet()) : null,
            m.getTecnologias() != null ? m.getTecnologias().stream().map(TecnologiaResponseDTO::new).collect(Collectors.toSet()) : null,
            m.getFichaTecnica() != null ? new FichaTecnicaResponseDTO(m.getFichaTecnica()) : null,
            m.getClustersNucleo() != null ? m.getClustersNucleo().stream().map(ClusterNucleoResponseDTO::new).collect(Collectors.toSet()) : null
        );
    }
}
