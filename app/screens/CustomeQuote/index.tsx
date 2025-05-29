// accbak/laundry-day-dream/accbak-laundry-day-dream-e7edca62d8a70de63bff20cfe46310379eaa1ad5/app/screens/CustomQuote/index.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary, launchCamera, ImagePickerResponse } from 'react-native-image-picker';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { supabase } from '../../services/supabase'; // Adjust path if needed
import { COLORS, SIZING, showCustomToast } from '../../utils'; // Adjust path if needed
import { FONTS } from '../../assets/fonts'; // Adjust path if needed
import { OrderButton, ErrorText } from '../../components'; // Adjust path if needed
import { useAtomValue } from 'jotai';
import { userAtom } from '../../store/auth'; // Adjust path if needed
import { v4 as uuidv4 } from 'uuid'; // You'll need to install this: npm install uuid @types/uuid

// --- Validation Schema ---
const CustomQuoteSchema = Yup.object().shape({
  itemName: Yup.string().required('Item name is required'),
  description: Yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
  urgency: Yup.string().required('Urgency is required'),
});

const CustomQuoteRequestScreen = () => {
  const navigation = useNavigation();
  const userInfo = useAtomValue(userAtom);
  const [uploading, setUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]); // Array of local image URIs
  const [supabaseImageUrls, setSupabaseImageUrls] = useState<string[]>([]); // Array of Supabase public URLs

  const {
    values,
    handleChange,
    handleSubmit,
    errors,
    touched,
    setFieldTouched,
    isSubmitting,
    setSubmitting,
  } = useFormik({
    initialValues: { itemName: '', description: '', urgency: 'standard' },
    validationSchema: CustomQuoteSchema,
    onSubmit: async (formValues) => {
      if (!userInfo?.userId) {
        showCustomToast('User not authenticated. Please log in.', 'danger');
        return;
      }
      if (selectedImages.length === 0) {
        showCustomToast('Please upload at least one picture.', 'warning');
        return;
      }

      setSubmitting(true);
      setUploading(true);

      try {
        // 1. Upload images to Supabase Storage
        const uploadedUrls: string[] = [];
        for (const imageUri of selectedImages) {
          const fileExtension = imageUri.split('.').pop();
          const fileName = `<span class="math-inline">\{userInfo\.userId\}/</span>{uuidv4()}.${fileExtension}`; // Unique filename for Supabase
          const response = await fetch(imageUri);
          const blob = await response.blob();

          const { data, error: uploadError } = await supabase.storage
            .from('custom-quote-images') // Your bucket name
            .upload(fileName, blob, {
              cacheControl: '3600',
              upsert: false,
              contentType: blob.type || 'image/jpeg', // Ensure content type
            });

          if (uploadError) {
            console.error('Image upload error:', uploadError);
            showCustomToast('Failed to upload image: ' + uploadError.message, 'danger');
            setUploading(false);
            setSubmitting(false);
            return;
          }

          // Get public URL
          const { data: publicUrlData } = supabase.storage
            .from('custom-quote-images')
            .getPublicUrl(fileName);

          if (publicUrlData) {
            uploadedUrls.push(publicUrlData.publicUrl);
          }
        }

        setSupabaseImageUrls(uploadedUrls); // Store for state if needed

        // 2. Insert custom quote request into custom_price_quotes table
        const { data, error: insertError } = await supabase
          .from('custom_price_quotes')
          .insert({
            user_id: userInfo.userId,
            item_name: formValues.itemName,
            description: formValues.description,
            image_url: uploadedUrls, // Array of URLs
            urgency: formValues.urgency,
            status: 'pending', // Default status as per schema
          })
          .select(); // Select the inserted row to get its ID, etc.

        if (insertError) {
          console.error('Insert quote error:', insertError);
          showCustomToast('Failed to submit quote request: ' + insertError.message, 'danger');
          return;
        }

        showCustomToast('Custom quote request submitted successfully!', 'success');
        navigation.goBack(); // Or navigate to a success screen
      } catch (error: any) {
        console.error('Error during quote submission:', error);
        showCustomToast('An unexpected error occurred: ' + error.message, 'danger');
      } finally {
        setUploading(false);
        setSubmitting(false);
      }
    },
  });

  const selectImage = () => {
    Alert.alert(
      "Upload Image",
      "Choose an option to upload image:",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Take Photo",
          onPress: () => launchCamera({
            mediaType: 'photo',
            quality: 0.7,
            maxWidth: 800,
            maxHeight: 600,
            saveToPhotos: true,
          }, (response: ImagePickerResponse) => {
            if (response.assets && response.assets.length > 0) {
              setSelectedImages(prev => [...prev, response.assets[0].uri as string]);
            } else if (response.errorMessage) {
              showCustomToast(`Camera error: ${response.errorMessage}`, 'danger');
            }
          }),
        },
        {
          text: "Choose from Library",
          onPress: () => launchImageLibrary({
            mediaType: 'photo',
            quality: 0.7,
            selectionLimit: 0, // 0 means no limit on selection
            maxWidth: 800,
            maxHeight: 600,
          }, (response: ImagePickerResponse) => {
            if (response.assets && response.assets.length > 0) {
              const newUris = response.assets.map(asset => asset.uri as string);
              setSelectedImages(prev => [...prev, ...newUris]);
            } else if (response.errorMessage) {
              showCustomToast(`Image library error: ${response.errorMessage}`, 'danger');
            }
          }),
        },
      ]
    );
  };

  const removeImage = (uriToRemove: string) => {
    setSelectedImages(prev => prev.filter(uri => uri !== uriToRemove));
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButttonContainer} onPress={() => navigation.goBack()}>
        <IonIcons size={SIZING.scaleWidth(7)} color={COLORS.WHITE} name="arrow-back" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.headerText}>Request Custom Quote</Text>
        <Text style={styles.subHeaderText}>
          Upload pictures of your items to get a personalized quote.
        </Text>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Item Details</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g., Wedding Dress, Large Rug"
          value={values.itemName}
          onChangeText={handleChange('itemName')}
          onBlur={() => setFieldTouched('itemName')}
        />
        <ErrorText error={errors.itemName} touched={touched.itemName} />

        <TextInput
          style={[styles.textInput, styles.multilineInput]}
          placeholder="Describe your item and the service needed (e.g., 'silk wedding dress, stain removal, dry cleaning')"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={values.description}
          onChangeText={handleChange('description')}
          onBlur={() => setFieldTouched('description')}
        />
        <ErrorText error={errors.description} touched={touched.description} />

        <Text style={styles.label}>Urgency:</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={[styles.radioButton, values.urgency === 'standard' && styles.radioButtonSelected]}
            onPress={() => handleChange('urgency')('standard')}
          >
            <Text style={values.urgency === 'standard' && styles.radioTextSelected}>Standard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.radioButton, values.urgency === 'express' && styles.radioButtonSelected]}
            onPress={() => handleChange('urgency')('express')}
          >
            <Text style={values.urgency === 'express' && styles.radioTextSelected}>Express</Text>
          </TouchableOpacity>
        </View>
        <ErrorText error={errors.urgency} touched={touched.urgency} />
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Upload Pictures</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={selectImage}>
          <IonIcons name="camera-outline" size={SIZING.scaleWidth(6)} color={COLORS.PRIMARY} />
          <Text style={styles.uploadButtonText}>Add Photos</Text>
        </TouchableOpacity>

        <View style={styles.imagePreviewContainer}>
          {selectedImages.map((uri, index) => (
            <View key={index} style={styles.imagePreviewWrapper}>
              <Image source={{ uri }} style={styles.imagePreview} />
              <TouchableOpacity style={styles.removeImageButton} onPress={() => removeImage(uri)}>
                <IonIcons name="close-circle" size={SIZING.scaleWidth(6)} color={COLORS.RED} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        {selectedImages.length === 0 && touched.description && (
          <ErrorText error="Please upload at least one picture" touched={true} />
        )}
      </View>

      <OrderButton
        title="Submit Quote Request"
        onPress={handleSubmit}
        loading={isSubmitting || uploading}
        disabled={isSubmitting || uploading}
      />
      <View style={{ height: SIZING.scaleHeight(5) }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    paddingTop: SIZING.scaleHeight(5),
  },
  backButttonContainer: {
    backgroundColor: COLORS.GRAY,
    borderRadius: SIZING.scaleWidth(2),
    opacity: 0.5,
    width: SIZING.scaleWidth(10),
    marginLeft: SIZING.scaleWidth(5),
    paddingVertical: SIZING.scaleHeight(0.7),
    alignItems: 'center',
    marginBottom: SIZING.scaleHeight(2),
  },
  header: {
    paddingHorizontal: SIZING.scaleWidth(5),
    marginBottom: SIZING.scaleHeight(2),
  },
  headerText: {
    fontSize: SIZING.scaleFont(6),
    fontFamily: FONTS.PoppinsSemiBold,
    color: COLORS.BLACK,
  },
  subHeaderText: {
    fontSize: SIZING.scaleFont(3.5),
    fontFamily: FONTS.PoppinsRegular,
    color: COLORS.GRAY,
    marginTop: SIZING.scaleHeight(0.5),
  },
  formSection: {
    backgroundColor: '#F8F8F8',
    marginHorizontal: SIZING.scaleWidth(5),
    borderRadius: SIZING.scaleWidth(2),
    padding: SIZING.scaleWidth(4),
    marginBottom: SIZING.scaleHeight(2),
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: SIZING.scaleFont(4.5),
    fontFamily: FONTS.PoppinsMedium,
    color: COLORS.BLACK,
    marginBottom: SIZING.scaleHeight(1.5),
  },
  label: {
    fontSize: SIZING.scaleFont(3.8),
    fontFamily: FONTS.PoppinsRegular,
    color: COLORS.BLACK,
    marginBottom: SIZING.scaleHeight(1),
    marginTop: SIZING.scaleHeight(1.5),
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.GRAY,
    borderRadius: SIZING.scaleWidth(2),
    paddingHorizontal: SIZING.scaleWidth(3),
    paddingVertical: SIZING.scaleHeight(1.2),
    fontSize: SIZING.scaleFont(3.5),
    fontFamily: FONTS.PoppinsRegular,
    color: COLORS.BLACK,
    backgroundColor: COLORS.WHITE,
  },
  multilineInput: {
    height: SIZING.scaleHeight(15),
    paddingTop: SIZING.scaleHeight(1.5),
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SIZING.scaleHeight(1),
  },
  radioButton: {
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    borderRadius: SIZING.scaleWidth(10),
    paddingVertical: SIZING.scaleHeight(1),
    paddingHorizontal: SIZING.scaleWidth(5),
    backgroundColor: COLORS.WHITE,
  },
  radioButtonSelected: {
    backgroundColor: COLORS.PRIMARY,
  },
  radioTextSelected: {
    color: COLORS.WHITE,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    borderRadius: SIZING.scaleWidth(2),
    paddingVertical: SIZING.scaleHeight(1.5),
    backgroundColor: '#E8F1FF', // Light blue background
  },
  uploadButtonText: {
    marginLeft: SIZING.scaleWidth(2),
    fontSize: SIZING.scaleFont(3.8),
    fontFamily: FONTS.PoppinsMedium,
    color: COLORS.PRIMARY,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SIZING.scaleHeight(2),
    justifyContent: 'flex-start',
  },
  imagePreviewWrapper: {
    position: 'relative',
    marginRight: SIZING.scaleWidth(2),
    marginBottom: SIZING.scaleHeight(1),
  },
  imagePreview: {
    width: SIZING.scaleWidth(25),
    height: SIZING.scaleHeight(12),
    borderRadius: SIZING.scaleWidth(1.5),
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: COLORS.GRAY,
  },
  removeImageButton: {
    position: 'absolute',
    top: -SIZING.scaleHeight(1),
    right: -SIZING.scaleWidth(1.5),
    backgroundColor: COLORS.WHITE,
    borderRadius: SIZING.scaleWidth(10),
  },
});

export default CustomQuoteRequestScreen;