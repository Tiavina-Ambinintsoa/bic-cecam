// common/util/ScoreColorMapper.java
package mg.cecam.bic.common.util;

public final class ScoreColorMapper {
    private ScoreColorMapper() {}

    public static String toHex(String couleur) {
        return switch (couleur) {
            case "Vert sombre" -> "#1B5E20";
            case "Vert clair" -> "#66BB6A";
            case "Jaune" -> "#F9A825";
            case "Rouge verdâtre" -> "#B71C1C";
            case "Rouge" -> "#D32F2F";
            default -> "#94A3B8";
        };
    }
}