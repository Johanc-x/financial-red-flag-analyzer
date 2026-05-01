package com.johan.financialanalyzer.security;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    @Test
    void shouldGenerateAndValidateToken() {
        JwtService jwtService = new JwtService();

        try {
            var field = JwtService.class.getDeclaredField("secretKey");
            field.setAccessible(true);
            field.set(jwtService, "una_clave_super_segura_con_mas_de_32_caracteres");
        } catch (Exception e) {
            fail("Could not inject JWT secret");
        }

        String token = jwtService.generateToken("admin");

        assertNotNull(token);
        assertTrue(jwtService.isTokenValid(token));
        assertEquals("admin", jwtService.extractUsername(token));
    }
}