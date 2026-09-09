package mg.cecam.bic.score;

public record ScoreDetail(double pointsPaiement, double pointsUtilisation, double pointsAnciennete,
                           double pointsNouveauxCredits, double pointsMixite) {
    public double total() { return pointsPaiement + pointsUtilisation + pointsAnciennete + pointsNouveauxCredits + pointsMixite; }
}