import { useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { Audio } from "expo-av";
import { useRouter } from "expo-router";
import { Colors, FontSize, Spacing, Radius } from "@/lib/theme";
import { Ionicons } from "@expo/vector-icons";
import { useResearchStore } from "@/stores/research-store";

type RecordingState = "idle" | "recording" | "paused" | "done";

function formatSeconds(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function VoiceScreen() {
  const router = useRouter();
  const [state, setState] = useState<RecordingState>("idle");
  const [duration, setDuration] = useState(0);
  const [uri, setUri] = useState<string | null>(null);
  const [speaker, setSpeaker] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { addOralTestimony } = useResearchStore();

  async function startRecording() {
    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) {
      Alert.alert("Permission refusée", "L'accès au microphone est nécessaire.");
      return;
    }
    await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    recordingRef.current = recording;
    setState("recording");
    timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
  }

  async function stopRecording() {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!recordingRef.current) return;
    await recordingRef.current.stopAndUnloadAsync();
    const fileUri = recordingRef.current.getURI();
    setUri(fileUri ?? null);
    setState("done");
  }

  async function togglePause() {
    if (!recordingRef.current) return;
    if (state === "recording") {
      await recordingRef.current.pauseAsync();
      if (timerRef.current) clearInterval(timerRef.current);
      setState("paused");
    } else if (state === "paused") {
      await recordingRef.current.startAsync();
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
      setState("recording");
    }
  }

  function saveTestimony() {
    if (!title.trim() || !speaker.trim()) {
      Alert.alert("Champs requis", "Renseignez le titre et le nom du témoin.");
      return;
    }
    addOralTestimony({
      title: title.trim(),
      speaker: speaker.trim(),
      interviewer: "Moi",
      summary: summary.trim(),
      trustNote: "",
      linkedEntityIds: [],
      tags: [],
      ...(uri ? { transcript: uri } : {}),
    });
    Alert.alert("Témoignage enregistré", "L'entretien a été sauvegardé.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  }

  function reset() {
    setDuration(0);
    setUri(null);
    setState("idle");
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {/* Recorder */}
      <View style={styles.recorderCard}>
        <Text style={styles.timer}>{formatSeconds(duration)}</Text>

        {state === "idle" && (
          <Pressable style={styles.recBtn} onPress={startRecording}>
            <Ionicons name="mic" size={36} color="white" />
          </Pressable>
        )}

        {(state === "recording" || state === "paused") && (
          <View style={styles.controls}>
            <Pressable style={styles.ctrlBtn} onPress={togglePause}>
              <Ionicons
                name={state === "recording" ? "pause" : "play"}
                size={24}
                color={Colors.accent}
              />
            </Pressable>
            <Pressable style={styles.stopBtn} onPress={stopRecording}>
              <Ionicons name="stop" size={24} color="white" />
            </Pressable>
          </View>
        )}

        {state === "done" && (
          <View style={styles.doneRow}>
            <Ionicons name="checkmark-circle" size={32} color={Colors.success} />
            <Text style={styles.doneText}>Enregistrement terminé</Text>
            <Pressable onPress={reset}>
              <Text style={styles.retakeText}>↩ Recommencer</Text>
            </Pressable>
          </View>
        )}

        <Text style={styles.stateLabel}>
          {state === "idle" && "Appuyez pour démarrer"}
          {state === "recording" && "Enregistrement en cours..."}
          {state === "paused" && "En pause"}
          {state === "done" && `Durée : ${formatSeconds(duration)}`}
        </Text>
      </View>

      {/* Metadata */}
      <Text style={styles.label}>Titre de l'entretien *</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="ex. Entretien avec Yamina, août 2024"
        placeholderTextColor={Colors.inkMuted}
      />

      <Text style={styles.label}>Nom du témoin *</Text>
      <TextInput
        style={styles.input}
        value={speaker}
        onChangeText={setSpeaker}
        placeholder="Prénom et nom"
        placeholderTextColor={Colors.inkMuted}
      />

      <Text style={styles.label}>Résumé (optionnel)</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={summary}
        onChangeText={setSummary}
        placeholder="Thèmes abordés, informations clés..."
        placeholderTextColor={Colors.inkMuted}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <Pressable
        style={[styles.saveBtn, state !== "done" && styles.saveBtnDisabled]}
        onPress={saveTestimony}
        disabled={state !== "done"}
      >
        <Text style={styles.saveBtnText}>Sauvegarder le témoignage</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.surfaceSunken },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  recorderCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.xxl,
    alignItems: "center",
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  timer: { fontSize: 48, fontWeight: "200", color: Colors.ink, letterSpacing: 2 },
  recBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  controls: { flexDirection: "row", gap: Spacing.lg, alignItems: "center" },
  ctrlBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  stopBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  doneRow: { alignItems: "center", gap: Spacing.sm },
  doneText: { fontSize: FontSize.base, color: Colors.success, fontWeight: "500" },
  retakeText: { fontSize: FontSize.sm, color: Colors.accent },
  stateLabel: { fontSize: FontSize.sm, color: Colors.inkMuted },
  label: { fontSize: FontSize.sm, fontWeight: "500", color: Colors.inkSecondary, marginBottom: Spacing.xs, marginTop: Spacing.md },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.base,
    color: Colors.ink,
  },
  multiline: { minHeight: 90, paddingTop: Spacing.sm },
  saveBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    alignItems: "center",
    marginTop: Spacing.xl,
  },
  saveBtnDisabled: { backgroundColor: Colors.borderStrong },
  saveBtnText: { color: "white", fontSize: FontSize.base, fontWeight: "600" },
});
