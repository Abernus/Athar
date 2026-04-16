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
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
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
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
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
    Alert.alert("Témoignage sauvegardé", "L'entretien a été enregistré.", [
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
      {/* Recorder card */}
      <View style={styles.recorderCard}>
        {/* Waveform ring */}
        <View
          style={[
            styles.ring,
            state === "recording" && styles.ringActive,
            state === "done" && styles.ringDone,
          ]}
        >
          {state === "idle" && (
            <Pressable style={styles.recBtn} onPress={startRecording}>
              <Ionicons name="mic" size={32} color="white" />
            </Pressable>
          )}
          {(state === "recording" || state === "paused") && (
            <Text style={styles.timer}>{formatSeconds(duration)}</Text>
          )}
          {state === "done" && (
            <Ionicons name="checkmark" size={36} color={Colors.success} />
          )}
        </View>

        {/* Controls */}
        {(state === "recording" || state === "paused") && (
          <View style={styles.controls}>
            <Pressable style={styles.ctrlBtn} onPress={togglePause}>
              <Ionicons
                name={state === "recording" ? "pause" : "play"}
                size={22}
                color={Colors.accent}
              />
            </Pressable>
            <Pressable style={styles.stopBtn} onPress={stopRecording}>
              <Ionicons name="stop" size={20} color="white" />
            </Pressable>
          </View>
        )}

        {state === "done" && (
          <View style={styles.doneInfo}>
            <Text style={styles.doneText}>
              Durée : {formatSeconds(duration)}
            </Text>
            <Pressable style={styles.resetBtn} onPress={reset}>
              <Ionicons name="refresh-outline" size={14} color={Colors.accent} />
              <Text style={styles.resetText}>Recommencer</Text>
            </Pressable>
          </View>
        )}

        <Text style={styles.stateLabel}>
          {state === "idle" && "Appuyez pour démarrer"}
          {state === "recording" && "Enregistrement..."}
          {state === "paused" && "En pause"}
          {state === "done" && "Enregistrement terminé"}
        </Text>
      </View>

      {/* Metadata form */}
      <View style={styles.formCard}>
        <Text style={styles.label}>Titre de l'entretien *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="ex. Entretien avec Yamina"
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

        <Text style={styles.label}>Résumé</Text>
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
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.saveBtn,
          state !== "done" && styles.saveBtnDisabled,
          pressed && state === "done" && { opacity: 0.85 },
        ]}
        onPress={saveTestimony}
        disabled={state !== "done"}
      >
        <Ionicons
          name="checkmark-circle-outline"
          size={20}
          color={state === "done" ? "white" : Colors.inkMuted}
        />
        <Text
          style={[
            styles.saveBtnText,
            state !== "done" && { color: Colors.inkMuted },
          ]}
        >
          Sauvegarder
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.surfaceSunken },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },

  recorderCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xxl,
    alignItems: "center",
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadow.md,
  },
  ring: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  ringActive: {
    borderColor: Colors.danger,
    borderWidth: 4,
  },
  ringDone: {
    borderColor: Colors.success,
    backgroundColor: Colors.successLight,
  },
  timer: {
    fontSize: FontSize.xxl,
    fontWeight: "300",
    color: Colors.ink,
    letterSpacing: 2,
  },
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  stopBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  doneInfo: { alignItems: "center", gap: Spacing.sm },
  doneText: {
    fontSize: FontSize.base,
    color: Colors.inkSecondary,
    fontWeight: "500",
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  resetText: { fontSize: FontSize.sm, color: Colors.accent, fontWeight: "500" },
  stateLabel: { fontSize: FontSize.sm, color: Colors.inkMuted },

  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadow.sm,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.inkSecondary,
    marginBottom: Spacing.xs,
    marginTop: Spacing.lg,
  },
  input: {
    backgroundColor: Colors.surfaceSunken,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    fontSize: FontSize.base,
    color: Colors.ink,
  },
  multiline: { minHeight: 90, paddingTop: Spacing.sm + 2 },
  saveBtn: {
    flexDirection: "row",
    gap: Spacing.sm,
    backgroundColor: Colors.accent,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.xl,
    ...Shadow.md,
  },
  saveBtnDisabled: {
    backgroundColor: Colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  saveBtnText: { color: "white", fontSize: FontSize.base, fontWeight: "600" },
});
