import { useState } from "react";

import {
  AuthLayout,
  AuthButton,
  AuthDivider,
  AuthFootnote,
  AuthInlineLink,
  AuthMessage,
  EmailField,
  PasswordField,
  SocialButton,
} from "../../components/AuthForm";
import { useFieldErrors, type FieldErrors } from "../../hooks/useFieldErrors";
import { signIn, type OAuthProvider } from "../../services/oauth";
import { isGmailAddress } from "../../utils/validation";

type Field = "email" | "senha" | "social";

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { errors, clear, submit } = useFieldErrors<Field>();

  function handleLogin() {
    const found: FieldErrors<Field> = {};

    if (!email.trim()) {
      found.email = "É obrigatório digitar um email";
    } else if (!isGmailAddress(email)) {
      found.email = "Insira um email válido";
    }

    if (!senha) found.senha = "É obrigatório digitar uma senha";

    if (submit(found)) navigation.navigate("Main");
  }

  async function handleSocial(provider: OAuthProvider) {
    const result = await signIn(provider);
    if (result.ok) {
      navigation.navigate("Main");
      return;
    }
    submit({ social: result.message });
  }

  return (
    <AuthLayout
      title="Bem-vindo de volta"
      subtitle="Entre para continuar cuidando do seu dinheiro."
    >
      <EmailField
        value={email}
        error={errors.email}
        onChangeText={(text) => {
          setEmail(text);
          clear("email");
        }}
      />

      <PasswordField
        placeholder="Sua senha"
        value={senha}
        error={errors.senha}
        onChangeText={(text) => {
          setSenha(text);
          clear("senha");
        }}
      />

      <AuthInlineLink
        label="Esqueceu a senha?"
        onPress={() => submit({ social: "Recuperação de senha ainda não está disponível." })}
      />

      <AuthButton label="Entrar" onPress={handleLogin} />

      <AuthMessage text={errors.social} />

      <AuthDivider />

      <SocialButton
        provider="google"
        label="Continuar com Google"
        onPress={() => handleSocial("google")}
      />

      <SocialButton
        provider="apple"
        label="Continuar com Apple"
        onPress={() => handleSocial("apple")}
      />

      <AuthFootnote
        question="Não tem uma conta?"
        action="Registre-se"
        onPress={() => navigation.navigate("Register")}
      />
    </AuthLayout>
  );
}
