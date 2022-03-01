package com.bt.btbackend.service;

import com.bt.btbackend.model.AbstractBaseEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.Serializable;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface AbstractBaseService<T extends AbstractBaseEntity, ID extends Serializable>{


    public abstract T save(T entity);
    public abstract List<T> saveAll(List<T> entities);
    public abstract List<T> findAll();
    public abstract List<T> findByIds(ID[] ids);
    public abstract Page<T> findAllBySpecification(Map<String, String> search, Pageable pageable);
    public abstract List<T> findAllBySpecification(Map<String, String> search);


    public abstract Optional<T> findById(ID entityId);
    public abstract T update(T entity);
    public abstract T updateById(T entity, ID entityId);
    public abstract void delete(T entity);
    public abstract void deleteById(ID entityId);
    public abstract void deleteAllById(ID[] entityId);
    public abstract void deleteAll();


    // other methods u might need to be generic

}
