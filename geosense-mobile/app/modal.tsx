import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ModalScreen() {
  const router = useRouter();

  const handleEmailPress = () => {
    Linking.openURL('mailto:chatbot.support@geosense.com');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+9779812345678');
  };

  const handleWebsitePress = () => {
    Linking.openURL('https://geosense.vercel.app');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* App Info Section */}
        <View style={styles.section}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>GS</Text>
          </View>
          <Text style={styles.appTitle}>GeoSense AI</Text>
          <Text style={styles.appSubtitle}>Advanced Soil Strength Prediction</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>
            GeoSense AI is an advanced soil analysis platform that uses machine learning 
            to predict soil bearing capacity and provide construction recommendations. 
            Our AI-powered system helps civil engineers and construction professionals 
            make informed decisions about soil suitability for construction projects.
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          
          <View style={styles.featureItem}>
            <Ionicons name="analytics" size={24} color="#4CAF50" />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Soil Analysis</Text>
              <Text style={styles.featureDescription}>
                Get instant bearing capacity predictions based on soil parameters
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="image" size={24} color="#4CAF50" />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Image Recognition</Text>
              <Text style={styles.featureDescription}>
                Upload soil images for automatic soil type detection
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="map" size={24} color="#4CAF50" />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Location Mapping</Text>
              <Text style={styles.featureDescription}>
                Select locations on map to get soil data
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="chatbubbles" size={24} color="#4CAF50" />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>AI Assistant</Text>
              <Text style={styles.featureDescription}>
                Get help from GeoSense Bot for soil-related queries
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          
          <TouchableOpacity style={styles.contactItem} onPress={handlePhonePress}>
            <Ionicons name="call" size={20} color="#4CAF50" />
            <Text style={styles.contactText}>+977 9812345678</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem} onPress={handleEmailPress}>
            <Ionicons name="mail" size={20} color="#4CAF50" />
            <Text style={styles.contactText}>chatbot.support@geosense.com</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem} onPress={handleWebsitePress}>
            <Ionicons name="globe" size={20} color="#4CAF50" />
            <Text style={styles.contactText}>https://geosense.vercel.app</Text>
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <Text style={styles.description}>
            For technical support, feature requests, or bug reports, please contact 
            our support team via email or visit our website.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 GeoSense AI
          </Text>
          <Text style={styles.footerSubtext}>
            Civil Engineering Intelligence System
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  logo: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 14,
    color: '#689F38',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  version: {
    fontSize: 12,
    color: '#8BC34A',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#33691E',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#33691E',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  contactText: {
    fontSize: 15,
    color: '#33691E',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#DCEDC8',
  },
  footerText: {
    fontSize: 14,
    color: '#689F38',
    fontWeight: '600',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#8BC34A',
  },
});