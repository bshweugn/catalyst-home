package itmo.localpiper.backend.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import itmo.localpiper.backend.model.Invitation;

@Repository
public interface InvitationRepository extends CrudRepository<Invitation, Long>{
    
    @Override
    List<Invitation> findAll();
}
