package mg.cecam.bic.contrat;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import mg.cecam.bic.client.Client;
import mg.cecam.bic.common.enums.ModeRattachement;
import mg.cecam.bic.common.enums.PhaseDemande;
import mg.cecam.bic.common.enums.RoleClient;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "contrat")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Contrat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code_client_cb_cible")
private String codeClientCbCible; // renseigné uniquement si modeRattachement = DEMANDE_EXISTANTE

    @Column(name = "code_contrat_cb", unique = true, length = 20)
    private String codeContratCb;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "mode_rattachement", nullable = false, length = 30)
    private ModeRattachement modeRattachement;

    @NotBlank
    @Column(name = "type_contrat", nullable = false)
    private String typeContrat;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "role_client", nullable = false, length = 20)
    private RoleClient roleClient;

    @NotNull
    @Column(name = "date_demande", nullable = false)
    private LocalDate dateDemande;

    @NotNull @Positive
    @Column(name = "montant_finance", nullable = false)
    private BigDecimal montantFinance;

    @Column(name = "montant_echeance_mensuelle")
    private BigDecimal montantEcheanceMensuelle;

    @Column(name = "type_relation_entreprise")
    private String typeRelationEntreprise;

    @NotNull @Positive
    @Column(name = "nombre_total_echeances", nullable = false)
    private Integer nombreTotalEcheances;

    @NotBlank
    @Builder.Default
    private String devise = "Ariary malgache";

    @Column(name = "periodicite_paiement")
    private String periodicitePaiement;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "phase_demande", nullable = false, length = 20)
    private PhaseDemande phaseDemande = PhaseDemande.DEMANDE_EN_COURS;

    @Column(name = "date_derniere_modification")
    private LocalDateTime dateDerniereModification;

    @PrePersist
    @PreUpdate
    void onSave() {
        this.dateDerniereModification = LocalDateTime.now();
    }
}