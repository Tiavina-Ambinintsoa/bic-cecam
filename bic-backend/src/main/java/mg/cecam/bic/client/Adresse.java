package mg.cecam.bic.client;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "adresse")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Adresse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @NotBlank
    @Column(name = "type_adresse", nullable = false)
    private String typeAdresse;

    @NotBlank
    @Column(name = "adresse_complete", nullable = false, length = 500)
    private String adresseComplete;

    @Builder.Default
    private Boolean actuelle = true;
}