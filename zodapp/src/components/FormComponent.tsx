import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FocusEvent } from "react";
import FormError from "./FormError";

const userFormSchema = z.object({
  name: z
    .string()
    .min(4, { message: "O nome completo precisa de pelo menos 5 caracteres." })
    .regex(/^[A-ZÀ-Ÿ][A-zÀ-ÿ']+\s([A-zÀ-ÿ']\s?)*[A-ZÀ-Ÿ][A-zÀ-ÿ']+$/, {
      message:
        "O nome deve ser separado entre espaços e estar no formato correto.",
    }),
  telephone: z.string().regex(/^\([1-9]{2}\) 9[7-9]{1}[0-9]{3}\-[0-9]{4}$/, {
    message: "O telefone deve estar no formato correto",
  }),
  cep: z.string().regex(/^[0-9]{5}[0-9]{3}$/, {
    message: "Insira o cep no formato correto.",
  }),
  logradouro: z.string().min(4, { message: "Logradouro inválido." }),
  complemento: z.string().min(4, { message: "Complemento inválido." }),
  bairro: z.string().min(4, { message: "Bairro inválido." }),
  uf: z.string().min(2).max(2, {
    message: "A sigla do estado deve conter apenas dois caracteres.",
  }),
});

type UserFormSchema = z.infer<typeof userFormSchema>;

const FormComponent = () => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<UserFormSchema>({
    resolver: zodResolver(userFormSchema),
  });

  const handleCepBlur = async (e: FocusEvent<HTMLInputElement>) => {
    if (errors?.cep?.message) {
      return;
    }

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${e.target.value}/json/`
      );
      const data = await response.json();

      setValue("logradouro", data.logradouro);
      setValue("complemento", data.complemento);
      setValue("bairro", data.bairro);
      setValue("uf", data.uf);
      clearErrors(["bairro", "complemento", "logradouro", "uf"]);

      if (data.erro) {
        alert("Cep não encontrado.");
        setValue("logradouro", "");
        setValue("complemento", "");
        setValue("bairro", "");
        setValue("uf", "");
      }
    } catch (err) {
      alert("CEP inválido.");
    }
  };

  const handleUserFormSubmit = (data: UserFormSchema) => {
    alert("Formulário enviado com sucesso");
    reset();
  };

  return (
    <form className="form" onSubmit={handleSubmit(handleUserFormSubmit)}>
      <div className="wrapper">
        <label>Nome Completo</label>
        <input type="text" {...register("name")} placeholder="Leonardo Peres" />
        {errors.name && <FormError error={errors.name.message} />}
      </div>
      <div className="wrapper">
        <label>Telefone</label>
        <input
          type="text"
          {...register("telephone")}
          placeholder="(22) 99121-3223"
        />
        {errors.telephone && <FormError error={errors.telephone.message} />}
      </div>
      <div className="wrapper">
        <label>CEP</label>
        <input
          type="text"
          {...register("cep")}
          onBlur={handleCepBlur}
          placeholder="85807213"
        />
        {errors.cep && <FormError error={errors.cep.message} />}
      </div>

      <div className="wrapper">
        <label>Logradouro</label>
        <input type="text" {...register("logradouro")} />
        {errors.logradouro && <FormError error={errors.logradouro.message} />}
      </div>

      <div className="wrapper">
        <label>Complemento</label>
        <input type="text" {...register("complemento")} />
        {errors.complemento && <FormError error={errors.complemento.message} />}
      </div>

      <div className="wrapper">
        <label>Bairro</label>
        <input type="text" {...register("bairro")} />
        {errors.bairro && <FormError error={errors.bairro.message} />}
      </div>

      <div className="wrapper">
        <label>UF</label>
        <input type="text" {...register("uf")} />
        {errors.uf && <FormError error={errors.uf.message} />}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Loading..." : "Submit"}
      </button>
    </form>
  );
};

export default FormComponent;
