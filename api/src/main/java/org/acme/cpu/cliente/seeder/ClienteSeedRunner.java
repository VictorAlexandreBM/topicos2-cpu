package org.acme.cpu.cliente.seeder;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.quarkus.elytron.security.common.BcryptUtil;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.acme.cpu.cliente.models.Endereco;
import org.acme.cpu.cliente.models.Telefone;
import org.acme.cpu.cliente.models.Usuario;
import org.acme.cpu.cliente.models.enums.Perfil;
import org.acme.cpu.cliente.repositories.UsuarioRepository;
import org.acme.cpu.pedido.models.Cartao;
import org.jboss.logging.Logger;

import java.io.InputStream;
import java.util.HashSet;
import java.util.Set;

@ApplicationScoped
public class ClienteSeedRunner {

    @Inject
    Logger LOG;

    @Inject
    ObjectMapper objectMapper;

    @Inject
    UsuarioRepository usuarioRepository;

    @Transactional
    public void onStart(@Observes StartupEvent ev) {
        if (usuarioRepository.count() > 0) {
            LOG.info("[ClienteSeedRunner] Banco de usuários já populado. Pulando Seeder.");
            return;
        }

        LOG.info("[ClienteSeedRunner] Iniciando lotação de usuários...");

        try {
            seedUsuarios();
            LOG.info("[ClienteSeedRunner] Lotação de usuários concluída com sucesso.");
        } catch (Exception e) {
            LOG.error("[ClienteSeedRunner] Falha ao popular a base de usuários", e);
        }
    }

    private InputStream getStream(String filename) {
        return Thread.currentThread().getContextClassLoader().getResourceAsStream("seeds/cliente/" + filename);
    }

    private void seedUsuarios() throws Exception {
        JsonNode root = objectMapper.readTree(getStream("usuarios.json"));

        for (JsonNode node : root) {
            Usuario usuario = new Usuario();
            usuario.setEmail(node.get("email").asText());

            // Criptografa a senha antes de persistir
            String senhaCrua = node.get("senha").asText();
            usuario.setSenha(BcryptUtil.bcryptHash(senhaCrua));

            usuario.setPerfil(Perfil.fromTipo(node.get("perfil").asText()));
            usuario.setPrimeiroNome(node.get("primeiroNome").asText());
            usuario.setSobrenome(node.get("sobrenome").asText());
            usuario.setAtivo(node.get("ativo").asBoolean());

            // Processa Telefones
            if (node.hasNonNull("telefones")) {
                Set<Telefone> telefones = new HashSet<>();
                for (JsonNode telNode : node.get("telefones")) {
                    Telefone t = new Telefone();
                    t.setNumero(telNode.get("numero").asText());
                    t.setPrincipal(telNode.get("principal").asBoolean());
                    telefones.add(t);
                }
                usuario.setTelefones(telefones);
            }

            // Processa Endereços
            if (node.hasNonNull("enderecos")) {
                Set<Endereco> enderecos = new HashSet<>();
                for (JsonNode endNode : node.get("enderecos")) {
                    Endereco e = new Endereco();
                    e.setCep(endNode.get("cep").asText());
                    e.setLogradouro(endNode.get("logradouro").asText());
                    e.setNumero(endNode.get("numero").asText());
                    if (endNode.hasNonNull("complemento")) {
                        e.setComplemento(endNode.get("complemento").asText());
                    }
                    e.setQuadra(endNode.get("quadra").asText());
                    e.setBairro(endNode.get("bairro").asText());
                    e.setCidade(endNode.get("cidade").asText());
                    e.setEstado(endNode.get("estado").asText());
                    enderecos.add(e);
                }
                usuario.setEnderecos(enderecos);
            }

            // Processa Cartões
            if (node.hasNonNull("cartoes")) {
                Set<Cartao> cartoes = new HashSet<>();
                for (JsonNode cartaoNode : node.get("cartoes")) {
                    Cartao c = new Cartao();
                    c.setGatewayToken(cartaoNode.get("gatewayToken").asText());
                    c.setUltimos4(cartaoNode.get("ultimos4").asText());
                    c.setBandeira(cartaoNode.get("bandeira").asText());
                    c.setMesExpiracao(cartaoNode.get("mesExpiracao").asInt());
                    c.setAnoExpiracao(cartaoNode.get("anoExpiracao").asInt());
                    c.setTitular(cartaoNode.get("titular").asText());
                    c.setAtivo(cartaoNode.get("ativo").asBoolean());
                    cartoes.add(c);
                }
                usuario.setCartoes(cartoes);
            }

            usuarioRepository.persist(usuario);
        }
    }
}