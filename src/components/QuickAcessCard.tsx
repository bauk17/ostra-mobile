import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type QuickAccessCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBackground: string;
  title: string;
  description: string;
};

function QuickAccessCard({
  icon,
  iconColor,
  iconBackground,
  title,
  description,
}: QuickAccessCardProps) {
  return (
    <Pressable style={styles.quickCard}>
      <View style={[styles.quickIcon, { backgroundColor: iconBackground }]}>
        <Ionicons name={icon} size={21} color={iconColor} />
      </View>

      <View style={styles.quickContent}>
        <Text style={styles.quickTitle}>{title}</Text>

        <Text style={styles.quickDescription}>{description}</Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#b7bdc9" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  quickAccess: {
    gap: 8,
  },

  quickCard: {
    minHeight: 61,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e8ef",
    padding: 15,
  },

  quickIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  quickContent: {
    flex: 1,
  },

  quickTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },

  quickDescription: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 3,
  },
});
export default QuickAccessCard;
