package com.cpad.group13.campusconnectapplication.oauth2;

import com.cpad.group13.campusconnectapplication.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.web.cors.CorsConfiguration;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    UserService userService;

    @Autowired
    private CustomOAuth2UserService oauthUserService;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().configurationSource(request -> {
                    var cors = new CorsConfiguration();
                    cors.setAllowedOrigins(List.of("http://localhost:8100"));
                    cors.setAllowedMethods(List.of("GET","POST", "PUT", "DELETE", "OPTIONS"));
                    cors.setAllowedHeaders(List.of("*"));
                    cors.setAllowCredentials(true);
                    return cors;
                }).and().csrf().disable()
                .authorizeRequests()
                .antMatchers("/", "/login", "/oauth2/**").permitAll()
                //.antMatchers("/**").permitAll()
                .anyRequest().authenticated()
                .and()
                .oauth2Login()
                .userInfoEndpoint()
                .userService(oauthUserService)
                .and()
                .successHandler(new AuthenticationSuccessHandler() {

                    @Override
                    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                                        Authentication authentication) throws IOException, ServletException {

                        /*Arrays.stream(response.getHeaderNames().toArray()).forEach(System.out::println);
                        Cookie cookie = new Cookie("JSESSIONID", "1234");
                        cookie.setHttpOnly(false);*/

                        /*String cookie = response.getHeader("Set-Cookie");
                        String[] headers = cookie.split(";");

                        response.setHeader("Set-Cookie", headers[0] + ";" + headers[1]);*/

                        CustomOAuth2User oauthUser = (CustomOAuth2User) authentication.getPrincipal();

                        userService.processOAuthPostLogin(oauthUser);

                        response.sendRedirect("http://localhost:8100/tabs/tab1/");
                    }
                })
                .and()
                .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("http://localhost:8100/login")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
        );
    }


}
