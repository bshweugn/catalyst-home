package itmo.localpiper.backend.service.processing;

public interface Processor<T, U> {
    U process(T request);
}
