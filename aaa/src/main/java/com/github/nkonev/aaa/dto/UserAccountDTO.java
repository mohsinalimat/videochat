package com.github.nkonev.aaa.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.github.nkonev.aaa.Constants;

import javax.validation.constraints.NotEmpty;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Created by nik on 22.06.17.
 * Contains public information
 */
@JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, include = JsonTypeInfo.As.PROPERTY, property = "@class")
public class UserAccountDTO implements Serializable {
    private static final long serialVersionUID = -5796134399691582320L;

    private Long id;

    @NotEmpty
    protected String login;

    private String avatar;

    @JsonFormat(shape=JsonFormat.Shape.STRING, pattern= Constants.DATE_FORMAT)
    private LocalDateTime lastLoginDateTime;

    private com.github.nkonev.aaa.dto.OauthIdentifiersDTO oauthIdentifiers = new com.github.nkonev.aaa.dto.OauthIdentifiersDTO();

    public UserAccountDTO(Long id, String login, String avatar, LocalDateTime lastLoginDateTime, com.github.nkonev.aaa.dto.OauthIdentifiersDTO oauthIdentifiers) {
        this.id = id;
        this.login = login;
        this.avatar = avatar;
        this.lastLoginDateTime = lastLoginDateTime;
        if (oauthIdentifiers!=null) {
            this.oauthIdentifiers = oauthIdentifiers;
        }
    }


    public UserAccountDTO() { }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public LocalDateTime getLastLoginDateTime() {
        return lastLoginDateTime;
    }

    public void setLastLoginDateTime(LocalDateTime lastLoginDateTime) {
        this.lastLoginDateTime = lastLoginDateTime;
    }

    public com.github.nkonev.aaa.dto.OauthIdentifiersDTO getOauthIdentifiers() {
        return oauthIdentifiers;
    }

    public void setOauthIdentifiers(OauthIdentifiersDTO oauthIdentifiers) {
        this.oauthIdentifiers = oauthIdentifiers;
    }
}
