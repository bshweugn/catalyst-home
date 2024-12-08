package itmo.localpiper.backend.service.processing;

public abstract class AbstractProcessor<Req, Res> implements Processor<Req, Res>{

    @Override
    public Res process(Req request) {
        Object result = send(request);
        return pack(result);
    }

    protected abstract Object send(Req request);

    protected abstract Res pack(Object result);

}
