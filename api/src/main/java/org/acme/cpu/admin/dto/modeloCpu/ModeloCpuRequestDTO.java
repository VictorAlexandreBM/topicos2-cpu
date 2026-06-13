package org.acme.cpu.admin.dto.modeloCpu;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.acme.cpu.admin.dto.modeloCpu.clusterNucleo.ClusterNucleoRequestDTO;
import org.acme.cpu.admin.dto.modeloCpu.fichaTecnica.FichaTecnicaRequestDTO;

import java.util.Set;

public record ModeloCpuRequestDTO(
        @NotBlank
        @Size(max = 100)
        String nome,

        @NotNull
        @Positive
        Long marcaId,

        @Positive
        Long socketId,

        @Valid
        @NotNull
        FichaTecnicaRequestDTO fichaTecnica,

        @Valid
        @NotEmpty
        @NotNull
        Set<ClusterNucleoRequestDTO> clustersNucleo,

        Set<@Positive Long> chipsetIds,
        Set<@Positive Long> tecnologiaIds
) {}