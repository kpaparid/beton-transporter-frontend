package com.bt.btbackend.security;

import java.io.IOException;
import java.io.InputStream;

import com.bt.btbackend.security.models.SecurityProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import org.springframework.core.io.ClassPathResource;


@Configuration
public class FirebaseConfig {

    @Autowired
    private SecurityProperties secProps;

    @Primary
    @Bean
    public FirebaseApp getfirebaseApp() throws IOException {
        InputStream inputStream = null;
        try {
            inputStream = new ClassPathResource("firebase_config.json").getInputStream();
        } catch (IOException e3) {
            e3.printStackTrace();
        }


        try {

            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(inputStream))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }
            System.out.println("Firebase Initialize");

        } catch (IOException e) {
            e.printStackTrace();
        }

        return FirebaseApp.getInstance();
    }

    @Bean
    public FirebaseAuth getAuth() throws IOException {
        return FirebaseAuth.getInstance(getfirebaseApp());
    }

//    @Bean
//    public FirebaseDatabase firebaseDatabase() throws IOException {
//        return FirebaseDatabase.getInstance();
//    }

//    @Bean
//    public Firestore getDatabase() throws IOException {
//        FirestoreOptions firestoreOptions = FirestoreOptions.newBuilder()
//                .setCredentials(GoogleCredentials.getApplicationDefault()).build();
//        return firestoreOptions.getService();
//    }

//    @Bean
//    public FirebaseMessaging getMessaging() throws IOException {
//        return FirebaseMessaging.getInstance(getfirebaseApp());
//    }

//    @Bean
//    public FirebaseRemoteConfig getRemoteConfig() throws IOException {
//        return FirebaseRemoteConfig.getInstance(getfirebaseApp());
//    }
}