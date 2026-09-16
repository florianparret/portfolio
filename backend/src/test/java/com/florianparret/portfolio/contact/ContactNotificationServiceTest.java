package com.florianparret.portfolio.contact;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.jsonPath;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withServerError;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

class ContactNotificationServiceTest {

    private static final ContactMessage MESSAGE = new ContactMessage("Jane Doe", "jane@example.com", "Bonjour.");

    @Test
    void sendsAnEmailThroughTheResendApi() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        server.expect(requestTo("https://api.resend.com/emails"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header("Authorization", "Bearer test-key"))
                .andExpect(jsonPath("$.from").value("onboarding@resend.dev"))
                .andExpect(jsonPath("$.to[0]").value("admin@example.com"))
                .andExpect(jsonPath("$.reply_to[0]").value("jane@example.com"))
                .andRespond(withSuccess("{\"id\":\"abc\"}", MediaType.APPLICATION_JSON));

        ContactNotificationService service =
                new ContactNotificationService(builder, "test-key", "onboarding@resend.dev", "admin@example.com");

        service.notifyNewMessage(MESSAGE);

        server.verify();
    }

    @Test
    void neverThrowsWhenTheApiCallFails() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        server.expect(requestTo("https://api.resend.com/emails")).andRespond(withServerError());

        ContactNotificationService service =
                new ContactNotificationService(builder, "test-key", "onboarding@resend.dev", "admin@example.com");

        assertThatCode(() -> service.notifyNewMessage(MESSAGE)).doesNotThrowAnyException();
    }
}
