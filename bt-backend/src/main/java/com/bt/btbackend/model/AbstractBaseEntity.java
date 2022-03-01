package com.bt.btbackend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jetbrains.annotations.NotNull;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import java.io.Serializable;
import java.util.UUID;

@MappedSuperclass
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AbstractBaseEntity implements Serializable, Comparable{
    private @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY) Long id;

    @Override
    public int compareTo(@NotNull Object o) {
        return 0;
    }
}
