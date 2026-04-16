import { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Colors, FontSize, Spacing, Radius, Shadow } from "@/lib/theme";
import { Ionicons } from "@expo/vector-icons";
import { useResearchStore } from "@/stores/research-store";

type Step = "shoot" | "review";

export default function PhotoCaptureScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [step, setStep] = useState<Step>("shoot");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [facing, setFacing] = useState<CameraType>("back");
  const { addArchiveItem } = useResearchStore();

  async function takePicture() {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
    if (photo) {
      setPhotoUri(photo.uri);
      setStep("review");
    }
  }

  async function pickFromLibrary() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
      setStep("review");
    }
  }

  function saveArchiveItem() {
    if (!photoUri || !title.trim()) {
      Alert.alert("Titre requis", "Donnez un titre à cette archive.");
      return;
    }
    addArchiveItem({
      title: title.trim(),
      archiveType: "photo",
      description: notes.trim(),
      fileRef: photoUri,
      linkedEntityIds: [],
      tags: [],
      notes: "",
    });
    Alert.alert("Archive sauvegardée", "La photo a été ajoutée.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  }

  if (!permission) return <View style={styles.center} />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <View style={styles.permIcon}>
          <Ionicons name="camera-outline" size={40} color={Colors.borderStrong} />
        </View>
        <Text style={styles.permTitle}>Accès caméra</Text>
        <Text style={styles.permText}>
          Autorisez l'accès à la caméra pour photographier vos archives.
        </Text>
        <Pressable
          style={({ pressed }) => [styles.permBtn, pressed && { opacity: 0.85 }]}
          onPress={requestPermission}
        >
          <Text style={styles.permBtnText}>Autoriser</Text>
        </Pressable>
      </View>
    );
  }

  if (step === "shoot") {
    return (
      <View style={styles.camera}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing={facing}
        />
        <View style={styles.cameraControls}>
          <Pressable style={styles.sideBtn} onPress={pickFromLibrary}>
            <Ionicons name="images-outline" size={24} color="white" />
          </Pressable>
          <Pressable style={styles.shutterBtn} onPress={takePicture}>
            <View style={styles.shutterInner} />
          </Pressable>
          <Pressable
            style={styles.sideBtn}
            onPress={() =>
              setFacing((f) => (f === "back" ? "front" : "back"))
            }
          >
            <Ionicons name="camera-reverse-outline" size={24} color="white" />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <View style={styles.previewCard}>
        <Image
          source={{ uri: photoUri! }}
          style={styles.preview}
          resizeMode="cover"
        />
      </View>

      <Pressable style={styles.retakeBtn} onPress={() => setStep("shoot")}>
        <Ionicons name="refresh-outline" size={16} color={Colors.accent} />
        <Text style={styles.retakeText}>Reprendre</Text>
      </Pressable>

      <View style={styles.formCard}>
        <Text style={styles.label}>Titre de l'archive *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="ex. Acte de naissance, Registre 1898"
          placeholderTextColor={Colors.inkMuted}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Contexte, source, localisation..."
          placeholderTextColor={Colors.inkMuted}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <Pressable
        style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.85 }]}
        onPress={saveArchiveItem}
      >
        <Ionicons name="checkmark-circle-outline" size={20} color="white" />
        <Text style={styles.saveBtnText}>Sauvegarder</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  camera: { flex: 1, backgroundColor: "#000" },
  cameraControls: {
    position: "absolute",
    bottom: 48,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: Spacing.xxl,
  },
  shutterBtn: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center",
    justifyContent: "center",
  },
  shutterInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 3,
    borderColor: "rgba(0,0,0,0.1)",
    backgroundColor: "white",
  },
  sideBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
    padding: Spacing.xxl,
    backgroundColor: Colors.surfaceSunken,
  },
  permIcon: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSunken,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  permTitle: {
    fontSize: FontSize.lg,
    fontWeight: "600",
    color: Colors.ink,
  },
  permText: {
    fontSize: FontSize.sm,
    color: Colors.inkMuted,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 260,
  },
  permBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    marginTop: Spacing.md,
  },
  permBtnText: { color: "white", fontWeight: "600", fontSize: FontSize.base },

  scroll: { flex: 1, backgroundColor: Colors.surfaceSunken },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  previewCard: {
    borderRadius: Radius.lg,
    overflow: "hidden",
    ...Shadow.md,
  },
  preview: { width: "100%", height: 240, backgroundColor: Colors.border },
  retakeBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: Spacing.xs,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  retakeText: { fontSize: FontSize.sm, color: Colors.accent, fontWeight: "500" },
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
  saveBtnText: { color: "white", fontSize: FontSize.base, fontWeight: "600" },
});
