import  { useContext, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LanguageContext } from '../context/LanguageContext';
import i18n from '../localization/i18n';

export default function Languages() {
  const { language, changeLanguage } = useContext(LanguageContext);

  useEffect(()=>{

  },[language])

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {i18n.t('welcome')} Languages
      </Text>

      <Picker
        selectedValue={language}
        onValueChange={(value) => changeLanguage(value)}
      >
        <Picker.Item label="English" value="en" />
        <Picker.Item label="Deutsch" value="de" />
        <Picker.Item label="日本語" value="ja" />
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  text: { fontSize: 20, marginBottom: 10 },
});
