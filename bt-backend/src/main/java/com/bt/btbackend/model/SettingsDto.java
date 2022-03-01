package com.bt.btbackend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "settings")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class SettingsDto extends AbstractBaseEntity {

    String key_string;
    String value;

    public SettingsDto(Long id, String key_string, String value) {
        this.setId(id);
        this.key_string = key_string;
        this.value = value;
    }
}
