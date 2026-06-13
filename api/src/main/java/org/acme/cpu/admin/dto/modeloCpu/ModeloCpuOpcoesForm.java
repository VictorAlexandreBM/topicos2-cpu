package org.acme.cpu.admin.dto.modeloCpu;

import org.acme.cpu.admin.dto.chipset.ChipsetResponseDTO;
import org.acme.cpu.admin.dto.marca.MarcaResponseDTO;
import org.acme.cpu.admin.dto.socket.SocketResponseDTO;
import org.acme.cpu.admin.dto.tecnologia.TecnologiaResponseDTO;

import java.util.List;

public record ModeloCpuOpcoesForm(
        List<MarcaResponseDTO> marcas,
        List<SocketResponseDTO> sockets,
        List<ChipsetResponseDTO> chipsets,
        List<TecnologiaResponseDTO> tecnologias
) {}