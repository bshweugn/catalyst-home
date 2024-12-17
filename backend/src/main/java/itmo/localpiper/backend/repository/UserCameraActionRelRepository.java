package itmo.localpiper.backend.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import itmo.localpiper.backend.model.Camera;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.model.UserCameraActionRel;

@Repository
public interface UserCameraActionRelRepository extends CrudRepository<UserCameraActionRel, Long> {
    @Override
    List<UserCameraActionRel> findAll();

    List<UserCameraActionRel> findAllByUserAndCamera(User user, Camera camera);
}
