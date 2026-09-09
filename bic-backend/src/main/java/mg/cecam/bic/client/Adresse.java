package mg.cecam.bic.client;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "adresse")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Adresse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    @JsonIgnore
    private Client client;

    @NotBlank
    @Column(name = "type_adresse", nullable = false)
    private String typeAdresse;

    @NotBlank
    @Column(name = "adresse_complete", nullable = false, length = 500)
    private String adresseComplete;

    @Column(name = "numero_rue")
    private String numeroRue;

    @Column(name = "code_postal")
    private String codePostal;

    private String ville;
    private String commune;
    private String region;
    private String pays;

    @Builder.Default
    private Boolean actuelle = true;

    @Column(name = "date_derniere_modification")
    private LocalDateTime dateDerniereModification;

    @PrePersist
    @PreUpdate
    void onSave() {
        this.dateDerniereModification = LocalDateTime.now();
    }
}