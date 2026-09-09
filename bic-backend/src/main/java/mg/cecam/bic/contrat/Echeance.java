package mg.cecam.bic.contrat;

import jakarta.persistence.*;
import lombok.*;
import mg.cecam.bic.common.enums.StatutEcheance;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "echeance")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Echeance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contrat_id", nullable = false)
    private Contrat contrat;

    @Column(name = "numero_echeance", nullable = false)
    private Integer numeroEcheance;

    @Column(name = "date_echeance", nullable = false)
    private LocalDate dateEcheance;

    @Column(name = "montant_du", nullable = false)
    private BigDecimal montantDu;

    @Column(name = "montant_paye")
    private BigDecimal montantPaye;

    @Column(name = "date_paiement")
    private LocalDate datePaiement;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatutEcheance statut;
}