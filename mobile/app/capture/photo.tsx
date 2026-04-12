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
import { Colors, FontSize, Spacing, Radius } from "@/lib/theme";
import { Ionicons } from "@expo/vector-icons";
import { useResearchStore } from "@/stores/research-store";

type Step = "shoot" | "review" | "link";

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
      Alert.alert("Titre requis", "Donnez un titre à cette archive avant de sauvegarder.");
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
    Alert.alert("Archive sauvegardée", "La photo a été ajoutée à vos archives.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  }

  if (!permission) return <View style={styles.center} />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permText}>L'accès à la caméra est nécessaire.</Text>
        <Pressable style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Autoriser la caméra</Text>
        </Pressable>
      </View>
    );
  }

  if (step === "shoot") {
    return (
      <View style={styles.camera}>
        <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} />
        <View style={styles.cameraControls}>
          <Pressable style={styles.galleryBtn} onPress={pickFromLibrary}>
            <Ionicons name="images-outline" size={24} color="white" />
          </Pressable>
          <Pressable style={styles.shutterBtn} onPress={takePicture}>
            <View style={styles.shutterInner} />
          </Pressable>
          <Pressable style={styles.flipBtn} onPress={() => setFacing(f => f === "back" ? "front" : "back")}>
            <Ionicons name="camera-reverse-outline" size={24} color="white" />
          </Pressable>
        </View>
      </View>
    );
  }

  if (step === "review" && photoUri) {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Image source={{ uri: photoUri }} style={styles.preview} resizeMode="cover" />

        <View style={styles.retakeRow}>
          <Pressable onPress={() => setStep("shoot")}>
            <Text style={styles.retakeText}>↩ Reprendre</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Titre de l'archive *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="ex. Acte de naissance, Registre 1898..."
          placeholderTextColor={Colors.inkMuted}
        />

        <Text style={styles.label}>Description (optionnel)</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Contexte, source, localisation dans le document..."
          placeholderTextColor={Colors.inkMuted}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <Pressable style={styles.saveBtn} onPress={saveArchiveItem}>
          <Text style={styles.saveBtnText}>Sauvegarder l'archive</Text>
        </Pressable>
      </ScrollView>
    );
  }

  return null;
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
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#ddd",
    backgroundColor: "white",
  },
  galleryBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  flipBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: Spacing.lg, padding: Spacing.xl },
  permText: { fontSize: FontSize.base, color: Colors.inkSecondary, textAlign: "center" },
  scroll: { flex: 1, backgroundColor: Colors.surfaceSunken },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  preview: { width: "100%", height: 260, borderRadius: Radius.md },
  retakeRow: { alignItems: "flex-start", marginTop: Spacing.sm, marginBottom: Spacing.lg },
  retakeText: { fontSize: FontSize.sm, color: Colors.accent },
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
  saveBtnText: { color: "white", fontSize: FontSize.base, fontWeight: "600" },
  btn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  btnText: { color: "white", fontWeight: "600" },
});
