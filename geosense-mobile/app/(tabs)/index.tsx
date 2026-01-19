import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';

interface FormData {
  moisture_content: string;
  bulk_density: string;
  foundation_depth: string;
  field_score: string;
  soil_type: string;
  grain_size_type: string;
}

interface Prediction {
  value: number;
  safety: 'Safe' | 'Moderate' | 'Unsafe';
}

export default function HomeScreen() {
  const params = useLocalSearchParams();

  const [formData, setFormData] = useState<FormData>({
    moisture_content: '',
    bulk_density: '',
    foundation_depth: '',
    field_score: '',
    soil_type: 'Sand',
    grain_size_type: 'Fine',
  });

  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  useEffect(() => {
    if (params.soil_type) {
      setFormData(prev => ({
        ...prev,
        soil_type: params.soil_type as string
      }));
    }
  }, [params.soil_type]);

  const handleImageUpload = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to your photo library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        setIsLoadingImage(true);
        const formDataImage = new FormData();
        
        // @ts-ignore - React Native FormData accepts this format
        formDataImage.append('file', {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: 'soil.jpg',
        });

        const response = await axios.post(
          'https://patronising-postcentral-pamella.ngrok-free.dev/image',
          formDataImage,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (response.data.soil) {
          const detectedSoil = response.data.soil.charAt(0).toUpperCase() + response.data.soil.slice(1);
          setFormData(prev => ({
            ...prev,
            soil_type: detectedSoil
          }));
          Alert.alert('Success', `Detected soil type: ${detectedSoil}`);
        }
      }
    } catch (err: any) {
      Alert.alert('Error', 'Failed to detect soil type from image');
    } finally {
      setIsLoadingImage(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.moisture_content || !formData.bulk_density || 
        !formData.foundation_depth || !formData.field_score) {
      Alert.alert('Validation Error', 'Please fill all fields');
      return;
    }

    setError('');
    setPrediction(null);
    setAiSuggestion(null);
    setIsLoading(true);

    const payload = {
      moisture_content: Number(formData.moisture_content),
      bulk_density: Number(formData.bulk_density),
      foundation_depth: Number(formData.foundation_depth),
      field_score: formData.field_score,
      soil_type: formData.soil_type,
      grain_size_type: formData.grain_size_type,
    };

    try {
      const response = await axios.post(
        'https://patronising-postcentral-pamella.ngrok-free.dev/predict',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      setPrediction({
        value: response.data.Prediction,
        safety: response.data.SafetyClass,
      });
    } catch (err: any) {
      const errorDetail = err.response?.data?.detail || err.message || 'Something went wrong';
      setError(`Error: ${errorDetail}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetSuggestion = async () => {
    if (!prediction) return;
    setIsLoadingSuggestion(true);
    setAiSuggestion(null);

    try {
      const response = await axios.post(
        'https://patronising-postcentral-pamella.ngrok-free.dev/aisuggest',
        {
          bearing_capacity: prediction.value,
          safety_class: prediction.safety
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setAiSuggestion(response.data.text);
    } catch (err) {
      setAiSuggestion('Error fetching AI suggestion. Please try again.');
    } finally {
      setIsLoadingSuggestion(false);
    }
  };

  const safetyColors: Record<string, string> = {
    Safe: '#4CAF50',
    Moderate: '#FF9800',
    Unsafe: '#F44336',
  };

  const safetyIcons: Record<string, string> = {
    Safe: '✓',
    Moderate: '⚠',
    Unsafe: '✗',
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>GS</Text>
        </View>
        <View>
          <Text style={styles.title}>GeoSense AI</Text>
          <Text style={styles.subtitle}>ADVANCED SOIL STRENGTH PREDICTION</Text>
        </View>
      </View>

      <View style={styles.form}>
        {/* Image Upload */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>📸 UPLOAD SOIL IMAGE</Text>
          <TouchableOpacity
            style={styles.imageButton}
            onPress={handleImageUpload}
            disabled={isLoadingImage}
          >
            <Text style={styles.imageButtonText}>
              {isLoadingImage ? 'Processing...' : 'Choose Image'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Soil Type */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>🌱 SOIL TYPE</Text>
          <View style={styles.buttonGroup}>
            {['Sand', 'Clay', 'Silt', 'Gravel'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.optionButton,
                  formData.soil_type === type && styles.optionButtonSelected
                ]}
                onPress={() => setFormData({ ...formData, soil_type: type })}
              >
                <Text style={[
                  styles.optionButtonText,
                  formData.soil_type === type && styles.optionButtonTextSelected
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Grain Size */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>🔬 GRAIN SIZE</Text>
          <View style={styles.buttonGroup}>
            {['Fine', 'Medium', 'Coarse'].map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.optionButton,
                  formData.grain_size_type === size && styles.optionButtonSelected
                ]}
                onPress={() => setFormData({ ...formData, grain_size_type: size })}
              >
                <Text style={[
                  styles.optionButtonText,
                  formData.grain_size_type === size && styles.optionButtonTextSelected
                ]}>
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Moisture Content */}
        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>💧 MOISTURE CONTENT</Text>
            <Text style={styles.unit}>(%)</Text>
          </View>
          <TextInput
            style={styles.input}
            value={formData.moisture_content}
            onChangeText={(text) => setFormData({ ...formData, moisture_content: text })}
            placeholder="15.5"
            keyboardType="decimal-pad"
            placeholderTextColor="#8BC34A"
          />
        </View>

        {/* Bulk Density */}
        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>⚖️ BULK DENSITY</Text>
            <Text style={styles.unit}>(g/cm³)</Text>
          </View>
          <TextInput
            style={styles.input}
            value={formData.bulk_density}
            onChangeText={(text) => setFormData({ ...formData, bulk_density: text })}
            placeholder="1.65"
            keyboardType="decimal-pad"
            placeholderTextColor="#8BC34A"
          />
        </View>

        {/* Foundation Depth */}
        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>⛏️ FOUNDATION DEPTH</Text>
            <Text style={styles.unit}>(m)</Text>
          </View>
          <TextInput
            style={styles.input}
            value={formData.foundation_depth}
            onChangeText={(text) => setFormData({ ...formData, foundation_depth: text })}
            placeholder="2.5"
            keyboardType="decimal-pad"
            placeholderTextColor="#8BC34A"
          />
        </View>

        {/* Field Observation */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>📝 FIELD OBSERVATION</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.field_score}
            onChangeText={(text) => setFormData({ ...formData, field_score: text })}
            placeholder="Describe soil condition..."
            multiline
            numberOfLines={4}
            placeholderTextColor="#8BC34A"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>🔍 ANALYZE SOIL STRENGTH</Text>
          )}
        </TouchableOpacity>

        {/* Prediction Result */}
        {prediction && (
          <View style={styles.resultContainer}>
            <View style={styles.resultHeader}>
              <View style={[styles.safetyIcon, { backgroundColor: safetyColors[prediction.safety] }]}>
                <Text style={styles.safetyIconText}>
                  {safetyIcons[prediction.safety]}
                </Text>
              </View>
              <View>
                <Text style={styles.resultTitle}>Analysis Complete</Text>
                <Text style={styles.resultSubtitle}>GEOSENSE AI PREDICTION</Text>
              </View>
            </View>

            <View style={styles.valueContainer}>
              <Text style={styles.valueText}>{prediction.value.toFixed(2)}</Text>
              <Text style={styles.unitText}>kN/m²</Text>
            </View>

            <View style={[styles.safetyBadge, { backgroundColor: safetyColors[prediction.safety] }]}>
              <Text style={styles.safetyText}>{prediction.safety} SOIL</Text>
              <Text style={styles.safetyDescription}>
                {prediction.safety === 'Safe'
                  ? '✓ Suitable for construction'
                  : prediction.safety === 'Moderate'
                  ? '⚠ Requires reinforcement'
                  : '✗ Requires soil treatment'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.suggestionButton}
              onPress={handleGetSuggestion}
              disabled={isLoadingSuggestion}
            >
              <Text style={styles.suggestionButtonText}>
                {isLoadingSuggestion ? 'Loading...' : 'Get AI Construction Suggestion'}
              </Text>
            </TouchableOpacity>

            {aiSuggestion && (
              <View style={styles.suggestionContainer}>
                <Text style={styles.suggestionText}>{aiSuggestion}</Text>
              </View>
            )}
          </View>
        )}

        {/* Error Display */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Analysis Error</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 16,
  },
  logoContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  subtitle: {
    fontSize: 10,
    color: '#689F38',
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#33691E',
    marginBottom: 8,
    letterSpacing: 1,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  unit: {
    fontSize: 11,
    color: '#8BC34A',
    fontWeight: '500',
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F9FBE7',
    borderWidth: 2,
    borderColor: '#DCEDC8',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  optionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#33691E',
  },
  optionButtonTextSelected: {
    color: 'white',
  },
  input: {
    backgroundColor: '#F9FBE7',
    borderWidth: 2,
    borderColor: '#DCEDC8',
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
    color: '#33691E',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageButton: {
    backgroundColor: '#F9FBE7',
    borderWidth: 2,
    borderColor: '#DCEDC8',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  imageButtonText: {
    color: '#4CAF50',
    fontWeight: '600',
    fontSize: 15,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  resultContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#F9FBE7',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#DCEDC8',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  safetyIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safetyIconText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#33691E',
  },
  resultSubtitle: {
    fontSize: 11,
    color: '#689F38',
    fontWeight: '500',
    letterSpacing: 1.2,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 20,
  },
  valueText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#33691E',
  },
  unitText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#689F38',
  },
  safetyBadge: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  safetyText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  safetyDescription: {
    color: 'white',
    fontSize: 13,
    fontWeight: '500',
  },
  suggestionButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  suggestionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  suggestionContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
  },
  suggestionText: {
    color: '#2E7D32',
    fontSize: 14,
    lineHeight: 20,
  },
  errorContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    borderLeftWidth: 6,
    borderLeftColor: '#F44336',
  },
  errorTitle: {
    color: '#D32F2F',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 6,
    letterSpacing: 0.8,
  },
  errorText: {
    color: '#B71C1C',
    fontSize: 13,
    lineHeight: 18,
  },
});