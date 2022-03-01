package com.bt.btbackend.repository;

import com.bt.btbackend.model.AbstractBaseEntity;
import com.bt.btbackend.model.Tour;
import com.bt.btbackend.service.AbstractBaseService;
import com.bt.btbackend.utils.AbstractSpecificationsBuilder;
import com.bt.btbackend.utils.SearchOperation;
import com.google.common.base.Joiner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.Serializable;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;


@Service
@Transactional
public abstract class AbstractBaseRepositoryImpl<T extends AbstractBaseEntity, ID extends Serializable>
        implements AbstractBaseService<T, ID>{

    private AbstractBaseRepository<T, ID> abstractBaseRepository;

    @Autowired
    public AbstractBaseRepositoryImpl(AbstractBaseRepository<T, ID> abstractBaseRepository) {
        this.abstractBaseRepository = abstractBaseRepository;
    }

    @Override
    public List<T> findByIds(ID[] ids) {
        return abstractBaseRepository.findAllById(Arrays.asList(ids));
    }

    @Override
    public T save(T entity) {
        return abstractBaseRepository.save(entity);
    }
    public List<T> saveAll(List<T> entities) {
        return abstractBaseRepository.saveAll(entities);
    }

    @Override
    public List<T> findAll() {
        return abstractBaseRepository.findAll();
    }

    @Override
    public Optional<T> findById(ID entityId) {
        return abstractBaseRepository.findById(entityId);
    }

    @Override
    public T update(T entity) {
        return (T) abstractBaseRepository.save(entity);
    }

    @Override
    public T updateById(T entity, ID entityId) {
        Optional<T> optional = abstractBaseRepository.findById(entityId);
        if(optional.isPresent()){
            return (T) abstractBaseRepository.save(entity);
        }else{
            return null;
        }
    }

    @Override
    public void delete(T entity) {
        abstractBaseRepository.delete(entity);
    }

    @Override
    public void deleteById(ID entityId) {
        abstractBaseRepository.deleteById(entityId);
    }
    @Override
    public void deleteAllById(ID[] entityId) {
        abstractBaseRepository.deleteAllById(Arrays.asList(entityId));
    }
    @Override
    public void deleteAll() {
        abstractBaseRepository.deleteAll();
    }
    @Override
    public Page<T> findAllBySpecification(Map<String, String> search, Pageable pageable) {
        Specification<T> spec = getSpecification(search);
        return abstractBaseRepository.findAll(spec, pageable);
    }
    @Override
    public List<T> findAllBySpecification(Map<String, String> search) {
        Specification<T> spec = getSpecification(search);
        return abstractBaseRepository.findAll(spec);
    }
    private Specification<T> getSpecification(Map<String, String> search){
        String result = String.join("&",search.entrySet()
                .stream()
                .filter(map -> !(map.getKey().equals("page") || map.getKey().equals("size") || map.getKey().equals("sort")))
                .collect(Collectors.toMap(map -> map.getKey(), map -> map.getKey() + '='+map.getValue())).values());
        AbstractSpecificationsBuilder builder = new AbstractSpecificationsBuilder();
        String operationSetExper = Joiner.on("|").join(SearchOperation.SIMPLE_OPERATION_SET);
//        Pattern pattern2 = Pattern.compile("(\\w+?)(" + operationSetExper + ")(\\p{Punct}?)(\\w+?)(\\p{Punct}?)&");
        Pattern pattern = Pattern.compile("(\\w+?)(" + operationSetExper + ")(([^&]*))");
        Matcher matcher = pattern.matcher(result+"&");
        while (matcher.find()) {
            builder.with(
                    matcher.group(1),
                    matcher.group(2),
                    matcher.group(3),"","");
        }

        Specification<T> spec = builder.build();
        return spec;
    }
}